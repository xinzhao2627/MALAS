import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './App.css';
import React, { useState} from 'react';

export default function RegCCD({setCcdProceed, items, setColorData}) {
    const [colors, setColors] = useState(Array(items).fill("turquoise"));
    const [inputs, setInputs] = useState(Array.from({ length: items }, (x, i) => 'CCD at ' + (i + 1)));
    const [target, setTarget] = useState(0);
    const [col, setCol] = useColor("hex", "#FFFFFF");
    const [toggler, setToggler] = useState(false);

    const handleClick = (i) => {
        setTarget(i);
        setToggler(true);
    };

    const handleClose = () => {
        setToggler(false); // Close the modal
    };

    const handleColorChange = (color) => {
        setCol(color);
        const update = colors.map((c, i) => (i === target ? color.hex : c));
        setColors(update);
    };

    const setValue = (e, i) => {
        setInputs(
            inputs.map((inp, j) => (j === i ? e.target.value : inp))
        );
    };

    const handleSave = (e) => {

        // check each color if different
        const uniqueColors = new Set(colors);
        const allUnique = uniqueColors.size === colors.length;

        // check each alias if different
        const uniqueKeys = new Set(inputs)
        const allUniqueKey = uniqueKeys.size === inputs.length

        if (allUnique && allUniqueKey){

            // check each input not null
            const isAllColors = inputs.every(inp => inp !== null)

            if (isAllColors) {

                // store each data into the dictionary
                const s = {}
                inputs.forEach((inp, i) => {
                    s[inp] = {hex: colors[i]}
                })
                setColorData(s)
                setCcdProceed(true)
                alert('All colors are in the dictionary')
            } else {
                setCcdProceed(false)
                alert('Some colors are not in the dictionary')
            }
        }else{
            alert('each colors/key must be different to each other')
        }

    }
    const pbn = (count) => {
        const a = [];
        for (let i = 0; i < count; i++) {
            a.push(
                <div className="col-12 col-sm-6 col-md-6 p-1" key={i}>
                    <div className="card work" style={{ border: 'none', color: 'white', width: '100%' }}>
                        <div className="img-section" style={{ backgroundColor: colors[i] }} onClick={() => handleClick(i)}></div>
                        <div className="card-desc">
                            <div className="card-header" style={{ padding: '0px', border: 'none', backgroundColor: 'transparent' }}>
                                <input
                                    type="password"
                                    className="card-title"
                                    placeholder={inputs[i]}
                                    onChange={(e) => setValue(e, i)}
                                />
                            </div>
                            <div className="card-time">{i + 1}</div>
                            <p className="recent" style={{ fontWeight: '700' }}>{colors[i]}</p>
                        </div>
                    </div>
                </div>
            );
        }
        return a;
    };

    return (
        <>
            <div className="container" style={{ width: '100%', height: (items === 3) ? '50vh' : '70vh' }}>
                <div className="row d-flex justify-content-center align-items-center">
                    {pbn(items)}
                </div>
            </div>
            {toggler &&
                <div className="modal show d-block prompt" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select Color</h5>
                            </div>
                            <div className="modal-body">
                                <ColorPicker color={col} onChange={handleColorChange} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="d-flex justify-content-center align-items-center m-3" style={{width:'100%'}}>
                <button className="btn btn-primary" style={{width:'100px', height:'100%'}} onClick={handleSave}>
                    Save
                </button>
            </div>
        </>
    );
}