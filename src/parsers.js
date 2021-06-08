function parseArray(value){
    if (!value) return undefined;
        if (typeof(value) === "string") return value.split("\n").map(line=>line.trim()).filter(line=>line);
        if (Array.isArray(value)) return value;
        throw "unsupported array format!";
}

function parseTags(value){
    if (!value) return undefined;
    if (Array.isArray(value)){
        if (!value.every(tag => tag.Key)){
            throw "Bad AWS Tags Format";
        }
        return value;
    }
    if (typeof(value) === "string"){
        value = value.split("\n").map(line=>line.trim()).filter(line=>line);
        return value.map((line) => {
            let [key, ...val] = line.split("=");
            if (Array.isArray(val)){
                val = val.join("=");
            }
            return { Key: key, Value: val };
        });
    }
    if (typeof(value) === "object"){
        return Object.entries(value).map(([key, val])=>{
            return { Key: key, Value: val };
        });
    }
    throw "Unsupported tags format!";
}



module.exports = {
    number: (value)=>{
        if (!value) return undefined;
        const parsed = parseInt(value);
        if (parsed === NaN) {
            throw `Value ${value} is not a valid number`
        }
        return parsed;
    },
    autocomplete: (value)=>{
        if (!value) return undefined;
        if (value.id) return value.id;
        return value;
    },
    array: parseArray,
    tags: parseTags,
    object: (value) => {
        if (!value) return undefined;
        if (typeof(value) === "object") return value;
        else if  (typeof(value) === "string") {
            value = value.split("\n").map(line=>line.trim()).filter(line=>line);
            const obj = {};
            return value.forEach(line => {
                let [key, ...val] = line.split("=");
                if (!val || !key){
                    throw "bad object format"
                }
                if (Array.isArray(val)){
                    val = val.join("=");
                }
                obj[key] = val;
            });
        }
        throw "Unsupported object format!";
    },
    string: (value)=>{
        if (!value) return undefined;
        if (typeof(value) === "string") return value.trim();
        return String(value);
    }
}