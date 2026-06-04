export interface Step {
  name: string;
  text: string;
}

export interface GuideSchemaData {
  steps: Step[];
  totalTime: string;
  supply: string[];
  tool: string[];
}

export const guideSchemaData: Record<string, GuideSchemaData> = {
  'v60-ratio-calculator': {
    totalTime: 'PT8M',
    supply: ['Coffee beans (20g)', 'Filtered water (300g)'],
    tool: ['Hario V60 Dripper', 'V60 Paper Filter', 'Gooseneck Kettle', 'Digital Scale', 'Timer'],
    steps: [
      { name: 'Prepare the Filter and Rinse', text: 'Place your V60 dripper over your carafe. Insert the paper filter and rinse it with hot water to remove papery taste and preheat the vessel.' },
      { name: 'Weigh and Grind', text: 'Weigh out 20g of coffee and grind to a medium-fine consistency (like kosher salt). Add to the filter and level the bed.' },
      { name: 'The Bloom', text: 'Start timer and pour 40-50g of water. Swirl gently to ensure all grounds are saturated. Wait until 0:45.' },
      { name: 'The First Main Pour', text: 'At 0:45, pour steadily in circles until you reach 180g total. Finish this pour by 1:15.' },
      { name: 'The Final Pour', text: 'Add remaining water until you reach 300g. Use a gentle spiral to agitate. Finish pouring by 1:45.' },
      { name: 'The Stir and Swirl', text: 'Give the brew a gentle stir or swirl to knock grounds off the walls for a flat bed.' },
      { name: 'The Drawdown', text: 'Wait for the water to filter through completely. Total brew time should be between 2:45 and 3:15.' }
    ]
  },
  'aeropress-ratio-calculator': {
    totalTime: 'PT4M',
    supply: ['Coffee beans (15g)', 'Filtered water (250g)'],
    tool: ['AeroPress', 'AeroPress Paper Filter', 'Stirrer', 'Timer'],
    steps: [
      { name: 'Prepare AeroPress', text: 'Insert a filter into the cap and rinse with hot water. Screw the cap onto the chamber and place over a sturdy mug.' },
      { name: 'Add Coffee', text: 'Add 15g of medium-fine ground coffee to the chamber.' },
      { name: 'Pour Water', text: 'Start timer and pour 250g of hot water (93°C/200°F) into the chamber.' },
      { name: 'Stir', text: 'Give the coffee and water a quick, gentle stir to ensure even saturation.' },
      { name: 'Wait', text: 'Insert the plunger slightly to create a vacuum seal and wait until the timer reaches 2:00.' },
      { name: 'Press', text: 'Gently press the plunger down with steady pressure until you hear a hiss. This should take about 30 seconds.' }
    ]
  },
  'chemex-ratio-calculator': {
    totalTime: 'PT10M',
    supply: ['Coffee beans (30g)', 'Filtered water (500g)'],
    tool: ['Chemex Coffeemaker', 'Chemex Bonded Filter', 'Gooseneck Kettle', 'Scale'],
    steps: [
      { name: 'Prepare Filter', text: 'Open the Chemex filter so one side has three layers. Place it in the top and rinse with hot water.' },
      { name: 'Add Coffee', text: 'Add 30g of medium-coarse ground coffee. Level the bed.' },
      { name: 'The Bloom', text: 'Pour 60g of water and wait 45 seconds for the coffee to degas.' },
      { name: 'First Pour', text: 'Pour in a slow, circular motion until you reach 250g.' },
      { name: 'Second Pour', text: 'Slowly add the remaining water until you reach 500g.' },
      { name: 'Final Drawdown', text: 'Allow the coffee to filter through completely. Remove the filter and enjoy.' }
    ]
  },
  'french-press-ratio-calculator': {
    totalTime: 'PT10M',
    supply: ['Coffee beans (30g)', 'Filtered water (450g)'],
    tool: ['French Press', 'Scale', 'Timer', 'Spoon'],
    steps: [
      { name: 'Preheat', text: 'Rinse your French Press with hot water to warm it up.' },
      { name: 'Add Coffee', text: 'Add 30g of coarsely ground coffee to the bottom of the press.' },
      { name: 'Pour Water', text: 'Start timer and pour 450g of hot water, ensuring all grounds are soaked.' },
      { name: 'Wait and Stir', text: 'At 1:00, give the "crust" a gentle stir. Place the lid on without pressing.' },
      { name: 'Steep', text: 'Wait until the timer reaches 4:00.' },
      { name: 'Press', text: 'Gently press the plunger all the way to the bottom.' }
    ]
  },
  'cold-brew-ratio-calculator': {
    totalTime: 'PT24H',
    supply: ['Coffee beans (100g)', 'Cold filtered water (400g)'],
    tool: ['Large Jar or Cold Brew Maker', 'Filter (Nut milk bag or paper)'],
    steps: [
      { name: 'Grind Coarsely', text: 'Grind 100g of coffee very coarsely (like sea salt).' },
      { name: 'Combine', text: 'Place coffee in a jar and add 400g of cold water.' },
      { name: 'Stir', text: 'Gently stir to ensure all grounds are wet.' },
      { name: 'Steep', text: 'Cover and let sit at room temperature or in the fridge for 12-24 hours.' },
      { name: 'Filter', text: 'Strain the mixture through a fine-mesh filter or paper filter to remove all grounds.' },
      { name: 'Dilute', text: 'Your concentrate is ready. Dilute with water or milk to taste.' }
    ]
  },
  'espresso-ratio-calculator': {
    totalTime: 'PT5M',
    supply: ['Fresh coffee beans (18g)', 'Filtered water'],
    tool: ['Espresso Machine', 'Burr Grinder', 'Portafilter', 'Tamper', 'Digital Scale', 'Timer'],
    steps: [
      { name: 'Preheat Machine', text: 'Ensure your espresso machine is fully heated. Run a "blank" shot through the portafilter to warm it and the group head.' },
      { name: 'Grind and Dose', text: 'Grind 18g of coffee into your portafilter. The grind should be very fine, similar to powdered sugar or flour.' },
      { name: 'Distribute and Tamp', text: 'Level the grounds evenly. Press down firmly and level with your tamper (about 30 lbs of pressure) to create a uniform puck.' },
      { name: 'Prepare for Extraction', text: 'Lock the portafilter into the group head. Place your scale and cup underneath.' },
      { name: 'The Extraction', text: 'Start the pump and timer simultaneously. You should see the first drops after 5-8 seconds.' },
      { name: 'Monitor Yield', text: 'Watch the weight on your scale. For a 1:2 ratio, aim for 36g of liquid espresso.' },
      { name: 'Stop the Shot', text: 'Stop the pump when you reach your target yield. This should take between 25 and 30 seconds total.' }
    ]
  }
};
