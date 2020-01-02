export const productLink = (title, id) => {
    title += ""
    title = title.trim();
    title = title.replace(/[^-\dA-Z-a-z\s\.]/g, "");
    title = title.replace(/[\s\.]+/g, "-");
    if(title.startsWith("-"))title = title.substring(1);
    if(title.endsWith("-"))title = title.substring(0, title.length -1);
    return ("/products/"+title+"/"+id).toLowerCase();
}

export const catLink = (name) => {
    return "/search/cat/"+encodeURIComponent(name)
}

export const subCatLink = (name) => {
    return "/search/sub_cat/"+encodeURIComponent(name)
}

export const countryLink = (name) => {
    return "/search/country/"+encodeURIComponent(name)
}

export const stateLink = (name) => {
    return "/search/state/"+encodeURIComponent(name)
}

export const cityLink = (name) => {
    return "/search/city/"+encodeURIComponent(name)
}

export const catIconName = (cat_name) => {
    var name = "";
    if(cat_name.toLowerCase().includes("beauty")) {
        name = "beauty"

    } else if(cat_name.toLowerCase().includes("equipment")) {
        name = "equipment"

    } else if(cat_name.toLowerCase().includes("seeking")) {
        name = "jobseekers"

    } else if(cat_name.toLowerCase().includes("sports")) {
        name = "hobbies"

    } else {
        name = cat_name.split(" ")[0].toLowerCase().split(",")[0]
        if(name == "property") {
            name = "real-estate"
    
        }
    }
    return name;
}