import { useCallback, useEffect, useState } from "react";



const xmlToJson = useCallback((node) => {
    const json = {}

    let children = [...node.children]

    if (!children.length) return node.innerHTML

    for (let child of children) {
        const hasSiblings = children.filter(c => c.nodeName === child.nodeName).length > 1

        if (hasSiblings) {
            if (json[child.node] === undefined) {
                json[child.nodeName] = [xmlToJson(child)]
            }
            else {
                json[child.nodeName].push(xmlToJson(child))
            }
        }
        else {
            json[child.nodeName] = xmlToJson(child)
        }
    }
    return json
}, [])

const parseXLM = useCallback((xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'application/xml');
    return xmlToJson(xmlDoc) 
}, [xmlToJson])
