import axios from "axios";

// Convert XML -> JSON
const xmlToJson = (node) => {
    const json = {};
    const children = [...node.children];

    if (!children.length) return node.textContent;

    for (let child of children) {
        const childName = child.nodeName;
        if (json[childName] === undefined) {
            json[childName] = xmlToJson(child);
        } else {
            if (!Array.isArray(json[childName])) {
                json[childName] = [json[childName]];
            }
            json[childName].push(xmlToJson(child));
        }
    }
    return json;
};

const parseXML = (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    return xmlToJson(xmlDoc);
};

export const fetchTheatres = async () => {
    try {
        const res = await axios.get("https://www.finnkino.fi/xml/TheatreAreas/", {
            responseType: "text",
        });
        const data = parseXML(res.data);

        let areas = data.TheatreAreas.TheatreArea;
        if (!Array.isArray(areas)) areas = [areas];

        return areas
            .filter((t) => t.Name !== "Valitse alue/teatteri") // exclude placeholder
            .map((t) => ({
                id: t.ID,
                name: t.Name,
            }));
    } catch (err) {
        console.error("Failed to fetch theatres:", err);
        return [];
    }
};

// fetch schedule for selected theatre
export const fetchSchedule = async (areaId) => {
    try {
        const res = await axios.get(
            `https://www.finnkino.fi/xml/Schedule/?area=${areaId}&nrOfDays=7`,
            { responseType: "text" }
        );
        const data = parseXML(res.data);

        // If no shows exist, return empty array safely
        if (!data.Schedule?.Shows?.Show) {
            return [];
        }

        let shows = data.Schedule.Shows.Show;
        if (!Array.isArray(shows)) shows = [shows];

        // Normalize
        return shows.map((s) => ({
            id: s.ID,
            title: s.OriginalTitle,
            start: s.dttmShowStart,
            showtheatre: s.Theatre,
            auditorium: s.TheatreAuditorium,
            methodLang: s.PresentationMethodAndLanguage,
            method: s.PresentationMethod,
            lang: s.SpokenLanguage?.Name,
            image: s.Images?.EventMediumImagePortrait,
        }));
    } catch (err) {
        console.error("Failed to fetch schedule:", err);
        return [];
    }
};