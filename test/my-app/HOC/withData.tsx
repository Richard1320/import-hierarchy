// https://reactjs.org/docs/higher-order-components.html

import React, {useEffect, useState} from 'react';
import URLPattern from 'url-pattern';
import axios, {AxiosResponse} from 'axios';

// This function takes a component...
export default function withData(WrappedComponent: React.FC<any>, jsonFile: string) {
    // ...and returns another component...
    const HOC: React.FC<any> = (props) => {
        const routePattern = new URLPattern(jsonFile);
        const [data, setData] = useState({});

        useEffect(() => {
            // Reset state data
            setData({});

            const routeParams = Object.assign({}, props.match.params);
            fetchData(routeParams);
            // eslint-disable-next-line
        }, [props.match.params]);

        function fetchDataCallback(response: AxiosResponse) {
            // Merge JSON with existing data
            const newData = Object.assign(data, response.data);

            setData(newData);
        }

        function fetchData(routeParams: object) {
            // Loop through array of JSON files
            let dataPath = routePattern.stringify(routeParams);
            if (!dataPath) return;
            axios.get(dataPath).then(fetchDataCallback);
        }

        // ... and renders the wrapped component with the fresh data!
        // Notice that we pass through any additional props
        return <WrappedComponent {...props} data={data}/>;
    };

    return HOC;
}
