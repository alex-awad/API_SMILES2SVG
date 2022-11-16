from flask import Flask, request, jsonify
from flask_cors import CORS
from rdkit.Chem import MolFromSmiles
from rdkit.Chem.rdDepictor import Compute2DCoords
from rdkit.Chem.Draw import rdMolDraw2D
import re

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


pattern = re.compile("<\?xml.*\?>")  # To format svgs for the usage in HTML


@app.route("/api/conversion", methods=["POST"])
def post_smiles_to_svg():
    # Generate SVG from SMILES
    smiles = request.json["SMILES"]
    molecule = MolFromSmiles(smiles)
    if molecule:
        Compute2DCoords(molecule)
        drawer = rdMolDraw2D.MolDraw2DSVG(500, 500)
        drawer.DrawMolecule(molecule)
        drawer.FinishDrawing()

        # Get and format SVG
        result = drawer.GetDrawingText().replace("svg:", "")
        result = re.sub(pattern, "", result)

        return jsonify({"molSVG": result})
    else:
        return jsonify({"molSVG": "None"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
