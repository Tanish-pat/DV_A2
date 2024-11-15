# import pandas as pd
# import re

# def convert_usair_to_csv(input_file, output_file):
#     with open(input_file, 'r') as file:
#         lines = file.readlines()

#     # Filter out the header line
#     vertex_lines = lines[1:]  # Skip the first line which starts with '*Vertices'

#     vertices = []
#     for line in vertex_lines:
#         # Use regex to extract vertex information
#         match = re.match(r'^\s*(\d+)\s+"([^"]+)"\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)', line)
#         if match:
#             id = int(match.group(1))
#             name = match.group(2)
#             x = float(match.group(3))
#             y = float(match.group(4))
#             z = float(match.group(5))
#             vertices.append((id, name, x, y, z))

#     # Create a DataFrame and save to CSV
#     df = pd.DataFrame(vertices, columns=["id", "Name", "X", "Y", "Z"])
#     df.to_csv(output_file, id=False)

# # Example usage
# input_file_path = 'file_str/data_file.net'  # Replace with your input file path
# output_file_path = 'data.csv'  # Replace with your desired output file path
# convert_usair_to_csv(input_file_path, output_file_path)




import pandas as pd
import re

def convert_usair_to_csv(input_file, vertex_output_file, edge_output_file):
    with open(input_file, 'r') as file:
        lines = file.readlines()

    # Initialize lists for vertices and edges
    vertices = []
    edges = []
    reading_edges = False  # Flag to check if we're reading edges

    for line in lines:
        # Check if we reached the edges section
        if line.startswith('*Edges'):
            reading_edges = True
            continue  # Skip the '*Edges' line

        if reading_edges:
            # Use regex to extract edge information
            match = re.match(r'^\s*(\d+)\s+(\d+)\s+([0-9.]+)', line)
            if match:
                node1 = int(match.group(1))
                node2 = int(match.group(2))
                weight = float(match.group(3))
                edges.append((node1, node2, weight))
        else:
            # Use regex to extract vertex information
            match = re.match(r'^\s*(\d+)\s+"([^"]+)"\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)', line)
            if match:
                id = int(match.group(1))
                name = match.group(2)
                x = float(match.group(3))
                y = float(match.group(4))
                z = float(match.group(5))
                vertices.append((id, name, x, y, z))

    # Create DataFrames for vertices and edges and save to CSV
    vertex_df = pd.DataFrame(vertices, columns=["id", "Name", "X", "Y", "Z"])
    vertex_df.to_csv(vertex_output_file, id=False)

    edge_df = pd.DataFrame(edges, columns=["Node1", "Node2", "Weight"])
    edge_df.to_csv(edge_output_file, id=False)

# Example usage
input_file_path = 'data_file.net'  # Replace with your input file path
vertex_output_path = 'vertices.csv'          # Output for vertices
edge_output_path = 'edges.csv'                # Output for edges
convert_usair_to_csv(input_file_path, vertex_output_path, edge_output_path)
