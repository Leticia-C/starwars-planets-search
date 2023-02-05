import React from 'react';

export default class TableHeader extends React.Component {
  render() {
    return (
      <thead>
        <tr>
          <th id="name">Name</th>
          <th id="rotation">Rotation Period</th>
          <th id="orbital">Orbital Period</th>
          <th id="diameter">Diameter</th>
          <th id="climate">Climate</th>
          <th id="gravity">Gravity</th>
          <th id="terrain">Terrain</th>
          <th id="surface">Surface Water</th>
          <th id="population">Population</th>
          <th id="films">Films</th>
          <th id="created">Created</th>
          <th id="edited">Edited</th>
          <th id="url">Url</th>
        </tr>
      </thead>
    );
  }
}
