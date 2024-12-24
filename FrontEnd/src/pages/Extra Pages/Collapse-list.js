import React, { useState } from 'react';
import {Button} from 'reactstrap'
const CollapsibleList = ({ items, title, limit = 5 }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedItems = showAll ? items : items.slice(0, limit);

  return (
    <div>
      <h5>{title}</h5>
      <ul>
        {displayedItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {items.length > limit && (
        <Button outline={true} className='mr-2'onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : `Show More (${items.length - limit} more)`}
        </Button>
      )}
    </div>
  );
};

export default CollapsibleList;
