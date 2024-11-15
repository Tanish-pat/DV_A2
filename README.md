# SciViz Visualizations and Analysis README

## Project Overview
This repository contains the scientific and informative visualizations developed for analyzing complex datasets related to climate variables, weather patterns, and structural damage. These visualizations provide insights into spatial, temporal, and relational dynamics using advanced plotting and mapping techniques.

---

## Components of SciViz

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
