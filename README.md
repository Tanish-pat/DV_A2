
# DV Assignment 2
## Project Overview


This repository houses a comprehensive set of informative visualizations designed to analyze diverse datasets related to structural damage, climate variables, weather patterns, and network connectivity. By employing advanced plotting, mapping, and interaction techniques, these visualizations reveal multivariate, hierarchical, spatial, temporal, and relational patterns. The insights provided are essential for critical decision-making in disaster management, infrastructure planning, and environmental analysis.


## Folder Structure

### It is bifurcated into two folders INFOVIZ and SciViz

In INFOVIZ we can see various files based on the different types of infographic visualisations For seeing the gifs kindly go to **INFOVIZ PICS** folder where you can find GIFs and pictures based on different requirements

In SCIVIZ we can see various folders there **images** and **gifs** folder there all the images and the corresponding gifs are located 

## The Infoviz visualisation consists of

### 1. Parallel Coordinates Plot
Enables multivariate analysis of earthquake structural damage across districts.

- **Implementation Details:**
  - Preprocessed earthquake damage data focusing on severity (e.g., foundation collapse, beam damage).
  - Aggregated district-level data to simplify analysis.
  - Created interactive plots with brushing and axis reordering using Plotly.
- **Features:**
  - **Brushing:** Highlight specific damage ranges.
  - **Axis Reordering:** Rearrange axes dynamically for easier trend analysis.
- **Output:**
  - Interactive PCPs embedded in HTML for stakeholder access.

---

### 2. Treemaps
Visualizes hierarchical earthquake damage patterns across districts and structural components.

- **Implementation Details:**
  - Used D3.js for interactive hierarchical visualizations.
  - Explored tiling algorithms like Squarify, Binary, and Dice for clarity and comparability.
- **Features:**
  - Hover and click interactions for detailed insights.
  - Color-coded damage levels to enhance interpretation.
- **Output:**
  - Interactive treemaps highlighting high-damage zones and structural vulnerabilities.

---

### 3. Node-Link Diagrams
Analyzes connectivity in weighted networks, such as transportation or communication systems.

- **Implementation Details:**
  - Preprocessed `.net` files into CSV formats for vertices and edges.
  - Applied force-directed layouts like Fruchterman-Reingold and Yifan Hu for structure clarity.
- **Features:**
  - Degree-based node adjustments to emphasize central hubs.
  - Interactive layouts showcasing key nodes and their relationships.
- **Output:**
  - Network diagrams illustrating connectivity, centrality, and clustering patterns.

---


## SciViz Visualizations consists of 



### 1. Quiver Plots
Visualizes vector fields such as wind flow using arrows to represent magnitude and direction.

- Implementation Details:
  - Preprocessed wind data (direction and speed) into U and V components.
  - Downsampled data for clarity.
  - Created quiver plots using Basemap and overlaid with topographical features.

- Output:
  - PNG images and animated GIFs showing wind evolution over time.

---

### 2. Streamlines
Augments quiver plots by visualizing smooth flow patterns of wind using streamlines.

- Implementation Details:
  - Data interpolated for a continuous flow map.
  - Used libraries like xarray, Matplotlib, and Basemap for implementation.

- Output:
  - Streamline maps showcasing airflow dynamics during significant weather events.

---

### 3. Color Maps
Represents scalar climate data (e.g., temperature, humidity) using diverse color palettes.

- Experimentation:
  - Explored global vs. local mapping and various scaling methods (e.g., logarithmic, continuous, discrete).
  - Selected optimal palettes, such as Viridis for subtle humidity variations and Hot Plate for energy release data.

- Output:
  - GIFs and high-resolution images showing climate variable progression.

---

### 4. Contour Maps
Highlights meteorological changes using contour gradients for parameters like precipitation, humidity, and vapor pressure deficit.

- Key Algorithms:
  - Marching Squares for boundary outlines.
  - Contour Fill for smooth transitions.

- Output:
  - Visualizations of weather anomalies like heatwaves and storms.

---


## Installation Guidelines
To replicate or extend the visualizations, the following software and libraries are required:

### Software:
- **Gephi**: For network analysis and node-link diagrams. [Download Gephi](https://gephi.org)
- **D3.js**: For interactive web-based visualizations like treemaps. [Learn about D3.js](https://d3js.org)
- **Plotly**: For creating dynamic and interactive visualizations like parallel coordinates plots. [Explore Plotly](https://plotly.com)

### Python Libraries:
Set up a virtual environment:
```bash
python3 -m venv venv
```

Install these libraries using `pip`:

```bash
pip install netCDF4 matplotlib imageio seaborn numpy xarray basemap pandas
```

## Authors
- Hemang Seth: Quiver plots, streamlines, treemaps.
- Tanish Pathania: Contour maps, node-link diagrams.
- Vasu Aggarwal: Color maps, parallel coordinates plots.

---

## Contact
For more information or collaboration, contact:
- Hemang.Seth@iiitb.ac.in
- Tanish.Pathania@iiitb.ac.in
- Vasu.Aggarwal@iiitb.ac.in
