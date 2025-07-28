import React, { useState } from 'react';
import { CarouselsHome } from "./carousels";
import { CategoryBar } from "./categoryBar";
import { EventList } from "./eventList";

export default function HomeBody() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="home-body-container">
      <CarouselsHome />
      <CategoryBar 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <EventList selectedCategory={selectedCategory} />
    </div>
  );
}