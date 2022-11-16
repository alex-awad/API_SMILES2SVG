import "./SmilesToSVG.css";
import React from "react";
import { useState, useEffect } from "react";

const SmilesToSVG = () => {
  const PORT = 5000;
  const API_URL = `http://localhost:${PORT}/api/conversion`;
  const [smilesInput, setSmilesInput] = useState("");
  const [molSVG, setMolSVG] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const get_svg = (smiles) => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        SMILES: smiles,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let molResponse = data["molSVG"];
        if (molResponse === "None") {
          setMolSVG("None");
        } else {
          const svg = new Blob([molResponse], { type: "image/svg+xml" });
          const svg_url = URL.createObjectURL(svg);
          setMolSVG(svg_url);
        }
      })
      .catch((error) => {
        console.error("ERROR:", error);
      });
  };

  const handleInputChange = (event) => {
    setSmilesInput(event.target.value);
  };

  useEffect(() => {
    get_svg(smilesInput);
  }, [smilesInput]);
  return (
    <>
      <div>
        <input
          type="text"
          id="smiles_input"
          onChange={handleInputChange}
          value={smilesInput}
          placeholder="Enter SMILES, e.g. 'CCOCC'"
        />
      </div>
      <div className={`image_frame`}>
        {molSVG !== "None" ? (
          <img src={molSVG} className={`svg_img`} />
        ) : (
          <div>Invalid SMILES!</div>
        )}
      </div>
    </>
  );
};

export default SmilesToSVG;
