// Define both dictionaries globally
let technical_soln_per_district = {};

// Function to fetch and parse CSV data
async function fetch_data() {
    console.log("Fetching data...");
    try {
        const response = await fetch('csv_building_structure.csv');
        const csvData = await response.text();

        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            step: function (row) {
                const district_id = row.data['district_id'];
                const technical_soln = row.data['technical_solution_proposed'];

                if (district_id) {
                    if (!technical_soln_per_district[district_id]) {
                        technical_soln_per_district[district_id] = {
                            'Major repair': 0,
                            'Reconstruction': 0,
                            'Minor repair': 0,
                            'No need': 0,
                            'Missing': 0
                        };
                    }

                    if (technical_soln === '') {
                        technical_soln_per_district[district_id]['Missing']++;
                    } else if (technical_soln_per_district[district_id][technical_soln] !== undefined) {
                        technical_soln_per_district[district_id][technical_soln]++;
                    }
                }
            },
            complete: function () {
                console.log("Data loading complete");
                console.log("Technical solution per district:", technical_soln_per_district);
                showTreeMap();  // Render tree map after data is loaded
            }
        });
    } catch (error) {
        console.error("Error fetching or parsing CSV:", error);
    }
}

// Tree map configurations
let currentColorScheme = 'interpolateBlues';
let currentLayout = 'squarify';

function updateColorScheme(colorScheme) {
    currentColorScheme = colorScheme;
    showTreeMap();
}

function updateLayout(layout) {
    currentLayout = layout;
    showTreeMap();
}

// Function to create the tree map data structure based on the selected category
function createTreeMapData(selectedCategory) {
    const data = {
        name: "Districts",
        children: []
    };

    for (const district_id in technical_soln_per_district) {
        const districtData = {
            name: district_id,
            children: []
        };

        if (selectedCategory === "All") {
            // Include all damage grades for each district
            for (const technical_soln in technical_soln_per_district[district_id]) {
                const value = technical_soln_per_district[district_id][technical_soln];
                if (value > 0) { // Only include grades with a non-zero value
                    districtData.children.push({
                        name: technical_soln,
                        value: value,
                        district_id: district_id
                    });
                }
            }
        } else {
            // Only include the selected grade for each district
            const value = technical_soln_per_district[district_id][selectedCategory];
            if (value > 0) { // Only include districts with a non-zero value for the selected grade
                districtData.children.push({
                    name: selectedCategory,
                    value: value,
                    district_id: district_id
                });
            }
        }

        if (districtData.children.length > 0) {
            data.children.push(districtData);
        }
    }

    return data;
}


// Show tree map with current selected category
function showTreeMap() {
    const selectedCategory = document.getElementById('category-select').value;
    const data = createTreeMapData(selectedCategory);

    // Existing code for rendering the tree map
    const width = 1200;
    const height = 600;

    let treemapLayout;
    switch (currentLayout) {
        case 'squarify':
            treemapLayout = d3.treemapSquarify;
            break;
        case 'binary':
            treemapLayout = d3.treemapBinary;
            break;
        case 'slice':
            treemapLayout = d3.treemapSlice;
            break;
        case 'dice':
            treemapLayout = d3.treemapDice;
            break;
        default:
            treemapLayout = d3.treemapSquarify;
    }

    const treemap = d3.treemap()
        .size([width, height])
        .padding(1)
        .tile(treemapLayout);

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    treemap(root);

    d3.select("#tree-map").html("");

    const svg = d3.select("#tree-map").append("svg")
        .attr("width", width)
        .attr("height", height);

    const colorScale = d3.scaleSequential(d3[currentColorScheme])
        .domain([0, d3.max(root.leaves(), d => d.value)]);

    const nodes = svg.selectAll(".node")
        .data(root.leaves())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    nodes.append("rect")
        .attr("class", "rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .style("fill", d => colorScale(d.value))
        .style("stroke", "black")
        .style("stroke-width", 1);

    nodes.append("text")
        .attr("x", 5)
        .attr("y", 15)
        .style("font-size", "12px")
        .each(function (d) {
            const districtName = d.parent ? d.parent.data.name : "Unknown District";

            // First line: District and name
            d3.select(this).append("tspan")
                .attr("x", 5)
                .attr("dy", "1em")
                .text(`District ${districtName} -`);

            // Second line: needed value
            d3.select(this).append("tspan")
                .attr("x", 5)
                .attr("dy", "1em")
                .text(`${d.data.name}`);

            // third line: needed value
            d3.select(this).append("tspan")
                .attr("x", 5)
                .attr("dy", "1em")
                .text(`needed: ${d.value}`);
        });


    const tooltip = d3.select("#tooltip");

    svg.selectAll(".node")
        .on("mouseover", function (event, d) {
            d3.select(this).select("rect")
                .style("stroke", "black")
                .style("stroke-width", 2);
            tooltip.style("opacity", 1)
                .html(`District: ${d.parent.data.name}<br>Grade: ${d.data.name}<br>Value: ${d.value}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            d3.select(this).select("rect").style("stroke", "none");
            tooltip.style("opacity", 0);
        });
}


// Update the tree map whenever the dropdown selection changes
document.getElementById('category-select').addEventListener('change', showTreeMap);

// Initial tree map rendering
showTreeMap();


// Load data on page load
window.onload = fetch_data;
