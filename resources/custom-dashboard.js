/*PNGUOT Utility Inventory dashboard extension (v2). 
Load this file AFTER resources/qgis2web.js so that `map` and the qgis2web layer variables already exist. 
Layers expected (names as exported by qgis2web; underscores are fine):
main_water_pipeline, main_sewer_pipeline, main_service_connections,
in_pipeline_junctions, main_end_nodes, main_manholes,main_blow_off_valves.
If a field below is reported as "not found", open the browser console (F12):
the actual attribute names of that layer are printed there. Add the real
name to the matching candidate list in FIELD_NAMES.*/

(function () {
  'use strict';

  layerSwitcher.hidePanel();

  /*1. CONFIGURATION
     Candidate attribute names per field. Matching ignores case,
     underscores, spaces and brackets, so 'Pipe ID' also matches Pipe_ID,
     PIPE_ID and pipe-id. Add your real field name if it is not covered*/
    
  const FIELD_NAMES = {
    length:       ['Length', 'Length m', 'LENGTH'],
    pipeId:       ['Pipe ID', 'PipeID', 'Pipe No', 'ID'],
    material:     ['Material', 'Pipe Material', 'Pipe Mat', 'Mat', 'Matl'],
    utilityType:  ['Utility Type', 'UtilityType', 'Util Type', 'Utility Ty', 'Utility'],
    manholeId:    ['Manhole ID', 'MH ID', 'MHID', 'Manhole No', 'ID'],
    manholeType:  ['Manhole Type', 'MH Type', 'Manhole Ty', 'Type'],
    depth:        ['Depth (m)', 'Depth m', 'Depth', 'Depth M'],
    serviceId:    ['Service ID', 'Connection ID', 'Conn ID', 'Service Connection ID', 'ID'],
    serveType:    ['Serve Type', 'ServeType', 'Service Type', 'Served Type', 'Serve Typ'],
    junctionId:   ['Junction ID', 'Junc ID', 'JunctionID', 'ID'],
    junctionType: ['Junction Type', 'Junc Type', 'JunctionType', 'Junction T', 'Type'],
    branches:     ['Number of Branch', 'Number of Branches', 'No of Branch', 'No of Branches',
                   'Num Branch', 'Num Branches', 'No Branch', 'Branches', 'Branch Count', 'Branch'],
    diaIn:        ['Diameter IN (mm)', 'Diameter IN', 'Dia IN (mm)', 'Dia IN', 'Dia In mm', 'DiaIn', 'Diameter In'],
    diaOut:       ['Diameter OUT (mm)', 'Diameter OUT', 'Dia OUT (mm)', 'Dia OUT', 'Dia Out mm', 'DiaOut', 'Diameter Out'],
    endId:        ['End Node ID', 'EndNode ID', 'Node ID', 'End ID', 'ID'],
    endType:      ['End Node Type', 'EndNode Type', 'End Type', 'Node Type', 'Type'],
    diameter:     ['Diameter (mm)', 'Diameter mm', 'Diameter', 'Dia mm', 'Dia', 'Size'],
    valveId:      ['Valve ID', 'ValveID', 'Valve No', 'ID'],
    location:     ['Location Description', 'Location Desc', 'Loc Description', 'Loc Desc',
                   'Location', 'Description', 'Location D']
  };

  const fld = (label, key, isId) => ({ label, candidates: FIELD_NAMES[key], isId: !!isId, key: null });

  // Seven layers = seven "zoom to layer" cards. `fields` = what the user can search by.

  const LAYER_DEFS = {
    water: {
      names: ['main water pipeline'], label: 'Main Water Pipelines', isLine: true,
      fields: [fld('Pipe ID', 'pipeId', true), fld('Material', 'material'), fld('Utility Type', 'utilityType')]
    },
    sewer: {
      names: ['main sewer pipeline'], label: 'Main Sewer Pipelines', isLine: true,
      fields: [fld('Pipe ID', 'pipeId', true), fld('Material', 'material'), fld('Utility Type', 'utilityType')]
    },
    services: {
      names: ['main service connection'], label: 'Main Service Connections',
      fields: [fld('ID', 'serviceId', true), fld('Serve Type', 'serveType')]
    },
    junctions: {
      names: ['main pipeline junction', 'main pipe junction'], label: 'Main Pipeline Junctions',
      fields: [fld('ID', 'junctionId', true), fld('Junction Type', 'junctionType'),
               fld('Number of Branch', 'branches'), fld('Diameter IN (mm)', 'diaIn'),
               fld('Diameter OUT (mm)', 'diaOut')]
    },
    endnodes: {
      names: ['main end node'], label: 'Main End Nodes',
      fields: [fld('ID', 'endId', true), fld('End Node Type', 'endType'), fld('Diameter (mm)', 'diameter')]
    },
    manholes: {
      names: ['main manhole'], label: 'Main Manholes',
      fields: [fld('ID', 'manholeId', true), fld('Type', 'manholeType'), fld('Depth (m)', 'depth')]
    },
    valves: {
      names: ['main blow off valve'], label: 'Main Blow-off Valves',
      fields: [fld('Valve ID', 'valveId', true), fld('Location Description', 'location', true)]
    }
  };

  // 2. HELPERS

  const normalise = (value) => String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase();

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function flattenLayers(collection) {
    const result = [];
    (collection || []).forEach((layer) => {
      if (layer && typeof layer.getLayers === 'function') {
        result.push(...flattenLayers(layer.getLayers().getArray()));
      } else if (layer) {
        result.push(layer);
      }
    });
    return result;
  }

  function findLayer(possibleNames) {
    const wanted = possibleNames.map(normalise);
    const candidates = flattenLayers(window.layersList || map.getLayers().getArray());
    return candidates.find((layer) => {
      const label = normalise(layer.get('popuplayertitle') || layer.get('title') || '');
      return wanted.some((name) => label.includes(name));
    }) || null;
  }

  function safeFeatures(layer) {
    if (!layer || !layer.getSource || !layer.getSource()) return [];
    const source = layer.getSource();
    return typeof source.getFeatures === 'function' ? source.getFeatures() : [];
  }

  function attributeKeys(features) {
    const keys = new Set();
    features.slice(0, 200).forEach((f) =>
      Object.keys(f.getProperties()).forEach((k) => { if (k !== 'geometry') keys.add(k); }));
    return [...keys];
  }

  function resolveKey(keys, candidates) {
    const wanted = candidates.map(normalise);
    // Respect candidate order so 'Pipe ID' beats a generic 'ID'.
    
    for (const name of wanted) {
      const hit = keys.find((k) => normalise(k) === name);
      if (hit) return hit;
    }
    return null;
  }

  function valueOf(feature, fd) {
    if (!fd || !fd.key) return 'Unknown';
    const raw = feature.get(fd.key);
    if (raw === undefined || raw === null || String(raw).trim() === '') return 'Unknown';
    return String(raw).trim();
  }

  function getFirstProperty(feature, names) {
    const keys = Object.keys(feature.getProperties());
    const key = resolveKey(keys, names);
    if (!key) return null;
    const value = feature.get(key);
    return value === undefined || value === null || String(value).trim() === '' ? null : value;
  }

  function parseNumber(value) {
    const match = String(value ?? '').replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : 0;
  }

  // Length in metres: use the attribute if present, otherwise measure the geometry.

  function featureLength(feature) {
    const attr = getFirstProperty(feature, FIELD_NAMES.length);
    if (attr !== null) return parseNumber(attr);
    const geom = feature.getGeometry();
    if (geom && ol.sphere && typeof ol.sphere.getLength === 'function') {
      return ol.sphere.getLength(geom, { projection: map.getView().getProjection() });
    }
    return 0;
  }

  function formatLength(metres) {
    if (!metres) return 'n/a';
    return metres >= 1000 ? `${(metres / 1000).toFixed(2)} km` : `${metres.toFixed(1)} m`;
  }

  function fitFeatures(features, maxZoom) {
    if (!features.length) return;
    const extent = ol.extent.createEmpty();
    features.forEach((feature) => {
      const geometry = feature.getGeometry();
      if (geometry) ol.extent.extend(extent, geometry.getExtent());
    });
    if (!ol.extent.isEmpty(extent)) {
      map.getView().fit(extent, {
        padding: [80, 420, 80, 80],
        maxZoom: maxZoom || 19,
        duration: 500
      });
    }
  }

  //3. LAYERS, FIELDS AND HIGHLIGHT LAYER

  const L = {};
  Object.entries(LAYER_DEFS).forEach(([key, def]) => {
    const layer = findLayer(def.names);
    const features = safeFeatures(layer);
    const keys = attributeKeys(features);
    def.fields.forEach((fd) => { fd.key = resolveKey(keys, fd.candidates); });
    L[key] = { ...def, key, layer, features, attributeKeys: keys };
  });

  // Highlight layer: sits on top, but is flagged non-interactive so qgis2web
  // popups still fire on the real feature underneath when you click it.

  function highlightStyle(feature) {
    const type = feature.getGeometry().getType();
    if (/Point/.test(type)) {
      return [
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 17,
            fill: new ol.style.Fill({ color: 'rgba(255, 214, 0, 0.35)' }),
            stroke: new ol.style.Stroke({ color: '#ff6d00', width: 3 })
          })
        })
      ];
    }
    if (/Line/.test(type)) {
      return [
        new ol.style.Style({ stroke: new ol.style.Stroke({ color: 'rgba(255, 214, 0, 0.75)', width: 10 }) }),
        new ol.style.Style({ stroke: new ol.style.Stroke({ color: '#ff6d00', width: 3 }) })
      ];
    }
    return [
      new ol.style.Style({
        fill: new ol.style.Fill({ color: 'rgba(255, 214, 0, 0.25)' }),
        stroke: new ol.style.Stroke({ color: '#ff6d00', width: 3 })
      })
    ];
  }

  const highlightSource = new ol.source.Vector();
  const highlightLayer = new ol.layer.Vector({
    source: highlightSource,
    style: highlightStyle,
    zIndex: 9999
  });
  highlightLayer.set('interactive', false);
  map.addLayer(highlightLayer);

  let flashTimer = null;
  function flashHighlight() {
    clearInterval(flashTimer);
    let n = 0;
    highlightLayer.setOpacity(1);
    flashTimer = setInterval(() => {
      n += 1;
      highlightLayer.setOpacity(n % 2 ? 0.2 : 1);
      if (n >= 6) {
        clearInterval(flashTimer);
        highlightLayer.setOpacity(1);
      }
    }, 220);
  }

  function highlightFeatures(features) {
    highlightSource.clear();
    features.forEach((f) => {
      const geometry = f.getGeometry();
      if (geometry) highlightSource.addFeature(new ol.Feature(geometry.clone()));
    });
    if (features.length) flashHighlight();
  }

  //4. MAP FURNITURE: scale bar, title, north arrow, toggle

  map.addControl(new ol.control.ScaleLine({
    units: 'metric', bar: true, steps: 4, text: true, minWidth: 135
  }));

  const title = document.createElement('div');
  title.id = 'Map-title';
  title.textContent = 'PNGUOT Utility Inventory Web Map';
  document.body.appendChild(title);

  const north = document.createElement('div');
  north.id = 'north-arrow';
  north.innerHTML = '<span class="north-label">N</span><span class="north-symbol" aria-hidden="true">↑</span>';
  north.setAttribute('aria-label', 'North arrow');
  document.body.appendChild(north);
  const northSymbol = north.querySelector('.north-symbol');
  const updateNorth = () => {
    const rotation = map.getView().getRotation() || 0;
    northSymbol.style.transform = `rotate(${-rotation}rad)`;
  };
  map.getView().on('change:rotation', updateNorth);
  updateNorth();

  const toggle = document.createElement('button');
  toggle.id = 'dashboard-toggle';
  toggle.type = 'button';
  toggle.textContent = 'Dashboard';
  toggle.setAttribute('aria-controls', 'dashboard-panel');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.appendChild(toggle);

  // Small add-on styles for the new elements (the main interface CSS is unchanged).

  const extraStyle = document.createElement('style');
  extraStyle.textContent = `
    .metric-card.active { outline: 3px solid #ffb300; box-shadow: 0 0 0 3px rgba(255,179,0,.35); }
    #breakdown-bars { max-height: 210px; overflow-y: auto; margin-top: 8px; }
    #result-list { max-height: 190px; overflow-y: auto; margin-top: 8px; }
    .result-row { display: block; width: 100%; text-align: left; padding: 6px 8px; margin: 0 0 4px;
      border: 1px solid #cfd8e3; border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; }
    .result-row:hover { background: #fff8e1; border-color: #ffb300; }
    .result-note { font-size: 12px; color: #5b6b7d; padding: 2px 2px 6px; }`;
  document.head.appendChild(extraStyle);

  //5. DASHBOARD PANEL

  const panel = document.createElement('aside');
  panel.id = 'dashboard-panel';
  panel.innerHTML = `
    <div class="dashboard-heading">
      <h2>PNGUOT Utility Inventory Dashboard</h2>
      <button class="dashboard-close" type="button" aria-label="Close dashboard">×</button>
    </div>
    <p class="dashboard-note">Select a card to zoom to and highlight a layer. Highlighted features flash in yellow/orange; click one on the map to open its information. Select Reset to restore everything.</p>
    <div class="dashboard-grid" id="metric-grid"></div>
    <section class="dashboard-section">
      <h3>Layer breakdown</h3>
      <div class="dashboard-actions">
        <select id="breakdown-layer" aria-label="Choose layer"></select>
        <select id="breakdown-field" aria-label="Choose field to search or break down by"></select>
      </div>
      <div id="breakdown-bars"></div>
    </section>
    <section class="dashboard-section">
      <h3>Interactive query</h3>
      <div class="dashboard-actions">
        <select id="value-filter" aria-label="Filter selected layer by value">
          <option value="">All values</option>
        </select>
        <input id="feature-search" type="search" placeholder="Search" aria-label="Search features">
        <button id="search-button" type="button">Search</button>
        <button id="reset-dashboard" type="button">Reset</button>
      </div>
      <div id="dashboard-status" role="status" aria-live="polite">Dashboard ready.</div>
      <div id="result-list"></div>
    </section>`;
  panel.hidden = true;
  document.body.appendChild(panel);

  const status = panel.querySelector('#dashboard-status');
  const setStatus = (text) => { status.textContent = text; };
  const showPanel = (show) => {
    panel.hidden = !show;
    toggle.setAttribute('aria-expanded', String(show));
  };
  toggle.addEventListener('click', () => showPanel(panel.hidden));
  panel.querySelector('.dashboard-close').addEventListener('click', () => showPanel(false));

  const layerSelect = panel.querySelector('#breakdown-layer');
  const fieldSelect = panel.querySelector('#breakdown-field');
  const barContainer = panel.querySelector('#breakdown-bars');
  const valueSelect = panel.querySelector('#value-filter');
  const searchInput = panel.querySelector('#feature-search');
  const resultList = panel.querySelector('#result-list');
  const metricGrid = panel.querySelector('#metric-grid');

  // 6. LAYER FILTERING (original qgis2web style is cached ONCE per layer)

  const originalStyles = new Map();

  function setLayerFilter(item, predicate) {
    if (!item.layer) return;
    if (!originalStyles.has(item.layer)) originalStyles.set(item.layer, item.layer.getStyle());
    const base = originalStyles.get(item.layer);
    if (!predicate) {
      item.layer.setStyle(base);
      return;
    }
    item.layer.setStyle((feature, resolution) => {
      if (!predicate(feature)) return null;
      return typeof base === 'function' ? base(feature, resolution) : base;
    });
  }

  function clearAllFilters() {
    Object.values(L).forEach((item) => setLayerFilter(item, null));
  }

  function setActiveCard(key) {
    metricGrid.querySelectorAll('.metric-card').forEach((card) =>
      card.classList.toggle('active', card.dataset.type === key));
  }

  // 7. METRIC CARDS (one "zoom to layer" card per layer)

  Object.values(L).forEach((item) => {
    let extra = '';
    if (item.isLine) {
      const total = item.features.reduce((s, f) => s + featureLength(f), 0);
      extra = `<span class="metric-label">${esc(formatLength(total))}</span>`;
    }
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `metric-card ${item.isLine ? 'neutral' : ''}`.trim();
    card.dataset.type = item.key;
    card.innerHTML = `<span class="metric-value">${item.features.length}</span><span class="metric-label">${esc(item.label)}</span>${extra}`;
    metricGrid.appendChild(card);
  });

  metricGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.metric-card');
    if (!card) return;
    const item = L[card.dataset.type];
    if (!item) return;
    layerSelect.value = item.key;
    renderBreakdown();
    applySelection(item, item.features,
      item.layer
        ? `${item.features.length} ${item.label} highlighted. Click a highlighted feature on the map to see its information.`
        : `${item.label} layer not found.`,
      false);
  });

  // 8. SELECTION = filter + highlight + zoom + result list

  function currentField(item) {
    const idx = Number(fieldSelect.value);
    return idx >= 0 ? item.fields[idx] : null;
  }

  function describe(item, feature) {
    const idField = item.fields[0];
    const primary = valueOf(feature, idField);
    const fd = currentField(item);
    if (fd && fd !== idField) return `${primary} · ${fd.label}: ${valueOf(feature, fd)}`;
    if (fd && fd === idField && item.fields[1]) return `${primary} · ${item.fields[1].label}: ${valueOf(feature, item.fields[1])}`;
    return primary;
  }

  function focusFeature(item, feature) {
    if (item.layer) item.layer.setVisible(true);
    highlightFeatures([feature]);
    fitFeatures([feature], 20);
    setStatus(`Zoomed to ${describe(item, feature)}. Click the highlighted feature to open its information.`);
  }

  function renderResults(item, features) {
    const MAX = 50;
    resultList.innerHTML = '';
    features.slice(0, MAX).forEach((feature) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'result-row';
      row.textContent = describe(item, feature);
      row.addEventListener('click', () => focusFeature(item, feature));
      resultList.appendChild(row);
    });
    if (features.length > MAX) {
      const note = document.createElement('div');
      note.className = 'result-note';
      note.textContent = `Showing the first ${MAX} of ${features.length}. Refine your search to narrow the list.`;
      resultList.appendChild(note);
    }
  }

  function applySelection(item, features, message, showList) {
    clearAllFilters();
    if (item.layer) item.layer.setVisible(true);
    if (features.length !== item.features.length) {
      const set = new Set(features);
      setLayerFilter(item, (f) => set.has(f));
    }
    highlightFeatures(features);
    fitFeatures(features);
    if (showList) renderResults(item, features); else resultList.innerHTML = '';
    setActiveCard(item.key);
    setStatus(message);
  }

  // 9. BREAKDOWN: choose layer + field, then bars / dropdown / search

  Object.values(L).forEach((item) => {
    const option = document.createElement('option');
    option.value = item.key;
    option.textContent = item.label;
    layerSelect.appendChild(option);
  });

  function renderBreakdown() {
    const item = L[layerSelect.value];

    // Field dropdown for this layer.
    const previous = fieldSelect.dataset.layer === item.key ? fieldSelect.value : '0';
    fieldSelect.innerHTML = '';
    item.fields.forEach((fd, i) => {
      const option = document.createElement('option');
      option.value = String(i);
      option.textContent = `By ${fd.label}`;
      fieldSelect.appendChild(option);
    });
    const any = document.createElement('option');
    any.value = '-1';
    any.textContent = 'Any attribute';
    fieldSelect.appendChild(any);
    fieldSelect.value = previous;
    fieldSelect.dataset.layer = item.key;

    const fd = currentField(item);
    barContainer.innerHTML = '';
    valueSelect.innerHTML = '<option value="">All values</option>';
    searchInput.value = '';
    searchInput.placeholder = fd ? `Search ${item.label} by ${fd.label}` : `Search any ${item.label} attribute`;

    if (!item.layer) { barContainer.textContent = `${item.label} layer not found.`; return; }
    if (!fd) { barContainer.textContent = 'Type in the search box below to search every attribute of this layer.'; return; }
    if (!fd.key) {
      barContainer.textContent = `The “${fd.label}” field was not found in ${item.label}. Press F12 and check the console for the real field names, then add yours to FIELD_NAMES.`;
      return;
    }
    if (fd.isId) {
      barContainer.textContent = `Type a ${fd.label} in the search box below, then press Search (${item.features.length} features in this layer).`;
      return;
    }

    const counts = {};
    item.features.forEach((f) => {
      const v = valueOf(f, fd);
      counts[v] = (counts[v] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const maxCount = Math.max(1, ...entries.map(([, c]) => c));
    entries.forEach(([label, count], i) => {
      if (i < 40) {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'bar-row';
        row.innerHTML = `<span>${esc(label)}</span><span class="bar-track"><span class="bar-fill" style="display:block;width:${(count / maxCount) * 100}%"></span></span><strong>${count}</strong>`;
        row.addEventListener('click', () => { valueSelect.value = label; applyValue(label); });
        barContainer.appendChild(row);
      }
      const option = document.createElement('option');
      option.value = label;
      option.textContent = `${label} (${count})`;
      valueSelect.appendChild(option);
    });
  }

  function applyValue(value) {
    const item = L[layerSelect.value];
    const fd = currentField(item);
    if (!fd || !fd.key) return;
    if (!value) {
      applySelection(item, item.features, `Showing all ${item.features.length} ${item.label}.`, false);
      return;
    }
    const wanted = normalise(value);
    const matches = item.features.filter((f) => normalise(valueOf(f, fd)) === wanted);
    applySelection(item, matches, `${matches.length} ${item.label} with ${fd.label} “${value}” highlighted.`, true);
  }

  layerSelect.addEventListener('change', () => {
    clearAllFilters();
    highlightSource.clear();
    resultList.innerHTML = '';
    setActiveCard(null);
    fieldSelect.dataset.layer = '';
    renderBreakdown();
    setStatus('Choose a value or search to find features in this layer.');
  });
  fieldSelect.addEventListener('change', () => {
    clearAllFilters();
    highlightSource.clear();
    resultList.innerHTML = '';
    renderBreakdown();
    setStatus('Choose a value or search to find features in this layer.');
  });
  valueSelect.addEventListener('change', (event) => applyValue(event.target.value));

  //10. SEARCH (selected layer, selected field)

  function searchFeatures() {
    const item = L[layerSelect.value];
    const raw = searchInput.value;
    const query = normalise(raw);
    if (!query) { setStatus('Enter a value to search.'); return; }
    if (!item.layer) { setStatus(`${item.label} layer not found.`); return; }

    const fd = currentField(item);
    let matches;
    if (fd) {
      if (!fd.key) {
        setStatus(`The “${fd.label}” field was not found in ${item.label}. Check the console (F12) for the real field names.`);
        return;
      }
      const contains = item.features.filter((f) => normalise(valueOf(f, fd)).includes(query));
      // For non-ID fields prefer exact matches (so depth "1" does not also return 1.5, 10 ...).
      const exact = fd.isId ? [] : contains.filter((f) => normalise(valueOf(f, fd)) === query);
      matches = exact.length ? exact : contains;
    } else {
      matches = item.features.filter((f) =>
        Object.entries(f.getProperties())
          .filter(([key]) => key !== 'geometry')
          .some(([, value]) => normalise(value).includes(query)));
    }

    if (!matches.length) {
      setStatus(`No ${item.label} matched “${raw}”${fd ? ` in ${fd.label}` : ''}.`);
      resultList.innerHTML = '';
      return;
    }
    applySelection(item, matches,
      `${matches.length} ${item.label} found for “${raw}”. Click a result to zoom to it.`, true);
    if (matches.length === 1) focusFeature(item, matches[0]);
  }

  panel.querySelector('#search-button').addEventListener('click', searchFeatures);
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') searchFeatures();
  });

  panel.querySelector('#reset-dashboard').addEventListener('click', () => {
    clearAllFilters();
    highlightSource.clear();
    clearInterval(flashTimer);
    valueSelect.value = '';
    searchInput.value = '';
    resultList.innerHTML = '';
    setActiveCard(null);
    setStatus('Filters and highlights reset.');
  });

  renderBreakdown();

  // 11. REPORT PROBLEMS VISIBLY (layer names and field names)

  const missingLayers = Object.values(L).filter((item) => !item.layer).map((item) => item.label);
  const missingFields = [];
  Object.values(L).forEach((item) => {
    if (!item.layer) return;
    item.fields.forEach((fd) => { if (!fd.key) missingFields.push(`${item.label}: ${fd.label}`); });
    if (item.fields.some((fd) => !fd.key)) {
      console.warn(`Utility dashboard: attribute names found in "${item.label}":`, item.attributeKeys);
    }
  });
  const problems = [];
  if (missingLayers.length) problems.push(`could not find layers: ${missingLayers.join(', ')}`);
  if (missingFields.length) problems.push(`could not match fields: ${missingFields.join('; ')} (press F12 for the real field names)`);
  if (problems.length) {
    setStatus(`Dashboard loaded, but ${problems.join(' | ')}.`);
    console.warn('Utility dashboard problems:', problems);
  }

  window.UTILITY_DASHBOARD = { layers: L, highlightFeatures, clearAllFilters, applySelection };
})();
