const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.post('/get_top_terms', (req, res) => {
    const { topic, noOfTopTerms, fields } = req.body;
    console.log('topic, noOfTopTerms, fields ', topic, noOfTopTerms, fields );
    let rawdata = null; 
    switch(topic) {
        case 'youtube':
            rawdata = fs.readFileSync('youtube_py.json');
            break;
        case 'olympicsByCountries':
            rawdata = fs.readFileSync('data_by_NOC.json');
            break;
        case 'olympicsBySports':
            rawdata = fs.readFileSync('data_by_Sport.json');
            break;
        default:
            rawdata = null;
            break;
    }
    // const noOfTopTerms = req.body.noOfTopTerms;
    // const fields = req.body.fields;
    const data = JSON.parse(rawdata);
    data.forEach(item=>{
        Object.keys(item.words).forEach(topic=>{
            if(fields.includes(topic)) {
                item.words[topic].splice(noOfTopTerms);
            } else {
                delete item.words[topic];
            }
        });
    });
    res.send(data);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));