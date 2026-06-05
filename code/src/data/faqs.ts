export interface FAQ {
  question: string;
  answer: string;
  slug: string;
}

export const faqs: FAQ[] = [
  {
    slug: "golden-ratio-coffee",
    question: "What is the golden ratio for coffee?",
    answer: "The 'Golden Ratio' for coffee is generally considered to be 1:17, which means 1 gram of coffee for every 17 grams of water. This ratio is widely accepted by the Specialty Coffee Association (SCA) because it provides a balanced extraction, allowing the coffee's natural flavors, acidity, and sweetness to shine without being too overwhelming or too weak. However, many enthusiasts prefer a slightly stronger 1:15 or 1:16 ratio depending on the brew method and personal taste preferences."
  },
  {
    slug: "calculate-coffee-water-ratio",
    question: "How do I calculate a coffee to water ratio?",
    answer: "To calculate your coffee-to-water ratio, simply divide the total weight of water by the desired ratio number. For example, if you want to brew with a 1:16 ratio and you have 320 grams of water, divide 320 by 16 to get 20 grams of coffee. Conversely, if you have 20 grams of coffee and want a 1:16 ratio, multiply 20 by 16 to find you need 320 grams of water. Using a digital scale is the most accurate way to ensure these measurements are precise every time."
  },
  {
    slug: "why-ratio-important",
    question: "Why is the coffee ratio important for taste?",
    answer: "The ratio is crucial because it determines the strength (Total Dissolved Solids) and the extraction level of your brew. Too much water (a high ratio like 1:20) can over-extract the grounds, leading to bitter, hollow flavors. Too little water (a low ratio like 1:12) can under-extract, resulting in a sour, salty, or overly concentrated taste. By controlling the ratio, you manage the balance between the solubles pulled from the beans and the water that carries them, directly impacting the body and flavor profile."
  },
  {
    slug: "1-15-vs-1-17-pour-over",
    question: "Is 1:15 or 1:17 better for pour over?",
    answer: "Both ratios are excellent for pour-over, but they offer different experiences. A 1:15 ratio results in a fuller-bodied, more intense cup where individual flavor notes are concentrated. It is often preferred for darker roasts or those who enjoy a punchy morning brew. A 1:17 ratio produces a cleaner, lighter, and more tea-like consistency, which often highlights the delicate floral and fruity notes of light-roasted specialty beans. The 'better' choice depends on whether you value intensity or clarity in your coffee."
  },
  {
    slug: "standard-espresso-ratio",
    question: "What is the standard espresso ratio?",
    answer: "The standard 'normale' espresso ratio is 1:2. This means if you use 18 grams of ground coffee in your portafilter, you should aim for a final liquid yield of 36 grams in the cup. This ratio provides the classic balance of intensity, crema, and mouthfeel that defines modern espresso. While traditional Italian espresso might lean closer to 1:1.5 or 1:2.5, the 1:2 ratio is the industry standard for most specialty coffee shops when dialing in their house blends and single-origin beans."
  },
  {
    slug: "grind-size-affect-ratio",
    question: "How does grind size affect the ideal coffee ratio?",
    answer: "Grind size and ratio are deeply interconnected. Finer grinds have more surface area, which speeds up extraction, often allowing for shorter ratios (like espresso). Coarser grinds have less surface area and extract more slowly, necessitating longer contact times or different ratios to achieve balance. If you change your ratio to be 'longer' (more water), you may need to coarsen your grind to prevent over-extraction. Conversely, if you use a 'shorter' ratio, a finer grind helps ensure you still extract enough flavor in the limited water volume."
  },
  {
    slug: "instant-coffee-ratio",
    question: "Can I use a coffee ratio for instant coffee?",
    answer: "While traditional ratios apply to brewing ground beans, you can still use a ratio for instant coffee to maintain consistency. Most instant coffee brands recommend 1 to 2 teaspoons per 6-8 ounces of water. In terms of weight, this is roughly a 1:50 to 1:70 ratio, as instant coffee is highly concentrated and fully soluble. Since the 'extraction' has already been done by the manufacturer, your 'ratio' here is purely about adjusting the strength of the final beverage to suit your palate."
  },
  {
    slug: "12-cup-coffee-maker-ratio",
    question: "What is the best ratio for a 12-cup coffee maker?",
    answer: "For a standard 12-cup drip coffee maker, where a 'cup' is usually 5 ounces (60 ounces total), you should use approximately 100 to 110 grams of coffee. This follows a standard 1:16 or 1:17 ratio. Many people make the mistake of using too little coffee for these large machines, leading to over-extracted and bitter results. For the best flavor, aim for roughly 2 tablespoons of ground coffee for every 6 ounces of water, or better yet, weigh your coffee to ensure you hit that 100g mark for a full carafe."
  },
  {
    slug: "grams-coffee-1-liter-water",
    question: "How many grams of coffee for 1 liter of water?",
    answer: "To brew 1 liter (1,000 grams) of coffee at a standard 1:16 ratio, you would need approximately 62.5 grams of coffee. If you prefer the SCA Golden Ratio of 1:17, you would use about 58.8 grams. For a stronger, more robust liter of coffee, a 1:15 ratio would require 66.7 grams. Using 60 grams per liter is a very common and easy-to-remember benchmark used by many professional baristas as a starting point for batch brewers and large French Press recipes."
  },
  {
    slug: "1-10-coffee-ratio-use",
    question: "What is a 1:10 coffee ratio used for?",
    answer: "A 1:10 coffee-to-water ratio is typically used for making coffee concentrates, such as those used in cold brew or AeroPress recipes. Because this ratio uses very little water relative to the coffee grounds, the resulting liquid is extremely intense and heavy-bodied. It is rarely consumed black; instead, it is often diluted with hot water (to make an Americano-style drink), cold water, milk, or poured over ice. This ratio is also common in 'Siphon' brewing or when creating a base for coffee-flavored cocktails."
  },
  {
    slug: "ratio-change-decaf",
    question: "How does the ratio change for decaf coffee?",
    answer: "Decaf coffee often requires a slightly different approach because the decaffeination process changes the cellular structure of the bean, making it more porous and faster to extract. Many baristas find that using a slightly 'shorter' ratio (e.g., 1:15 instead of 1:16) or a slightly coarser grind helps to balance the brew. Because decaf can sometimes lack the 'punch' of regular coffee, a tighter ratio helps to enhance the body and perceived sweetness, compensating for any flavor complexity lost during the caffeine removal process."
  },
  {
    slug: "brewing-ratio-vs-extraction-yield",
    question: "What is the difference between brewing ratio and extraction yield?",
    answer: "The brewing ratio is the relationship between the weight of dry coffee grounds and the water used (e.g., 1:16). Extraction yield, however, refers to the percentage of the dry coffee's mass that actually dissolves into the water. A perfect brew usually has an extraction yield of 18% to 22%. While the ratio sets the *potential* strength, the extraction yield tells you if you've pulled the right flavors out of the bean. You can have a 1:16 ratio that is under-extracted (sour) or over-extracted (bitter) depending on grind size and time."
  },
  {
    slug: "adjust-ratio-bitter-coffee",
    question: "How do I adjust my ratio if the coffee is too bitter?",
    answer: "If your coffee is bitter, it is likely over-extracted. To fix this using the ratio, you should try a 'shorter' ratio, meaning less water for the same amount of coffee (e.g., moving from 1:17 to 1:15). Bitterness occurs when water has pulled too many solubles out of the grounds. By reducing the total water volume, you stop the extraction before the bitter compounds dominate. Alternatively, you can keep the ratio the same but coarsen your grind size or lower the water temperature to slow down the extraction process."
  },
  {
    slug: "fix-sour-acidic-coffee",
    question: "What should I do if my coffee tastes too sour or acidic?",
    answer: "Sourness is usually a sign of under-extraction, meaning the water didn't pull enough sweetness and sugars out of the beans. To remedy this with your ratio, use a 'longer' ratio with more water (e.g., moving from 1:14 to 1:16). The additional water provides more opportunity to extract those later-stage sweet and bitter compounds that balance out the initial acidity. You can also try using a finer grind or hotter water to increase the extraction efficiency if you want to keep your current ratio."
  },
  {
    slug: "weight-vs-volume-coffee",
    question: "Is it better to measure coffee by weight or volume?",
    answer: "Measuring by weight (grams) is significantly better than measuring by volume (spoons or scoops). Coffee beans vary wildly in density depending on their roast level and origin; dark-roasted beans are larger and less dense than light-roasted beans. This means a tablespoon of dark roast might weigh 5 grams, while a tablespoon of light roast weighs 7 grams. If you use volume, your ratio will change with every bag of beans. A digital scale ensures that 20 grams is always 20 grams, leading to consistent, repeatable, and delicious coffee."
  },
  {
    slug: "tablespoons-in-15-grams",
    question: "How many tablespoons of coffee are in 15 grams?",
    answer: "On average, one level tablespoon of ground coffee weighs between 5 and 7 grams. Therefore, 15 grams of coffee is roughly 2 to 3 tablespoons. However, this varies significantly based on how finely the coffee is ground and the roast level. Because of this inaccuracy, using tablespoons often leads to inconsistent brewing ratios. If you don't have a scale, start with 2.5 level tablespoons for a standard 8-ounce cup and adjust based on whether the resulting brew tastes too weak or too strong for your preference."
  },
  {
    slug: "french-press-ratio",
    question: "What is the ideal ratio for French Press coffee?",
    answer: "The ideal ratio for French Press is typically 1:15. This immersion brewing method benefits from a slightly more concentrated ratio to highlight its characteristic heavy body and rich mouthfeel. For a standard 34-ounce (1 liter) French Press, you would use about 67 grams of coarsely ground coffee. Many people enjoy French Press because the metal filter allows oils to pass through; a 1:15 ratio ensures these oils are accompanied by enough dissolved solids to create a satisfying, robust cup that stands up well to milk or cream."
  },
  {
    slug: "cold-brew-high-ratio",
    question: "Why does Cold Brew require a higher coffee-to-water ratio?",
    answer: "Cold brew uses a high ratio (often 1:4 to 1:8) because it uses cold water, which is a much less efficient solvent than hot water. To compensate for the lack of heat, we use more coffee and much longer steeping times (12-24 hours). This creates a 'concentrate' rather than a ready-to-drink coffee. The high ratio ensures that even without heat, we extract enough flavor to create a bold, smooth beverage that can be diluted with water or milk without becoming watery or losing its distinct chocolatey and nutty profile."
  },
  {
    slug: "aeropress-ratio-best",
    question: "What is the best ratio for an AeroPress?",
    answer: "The AeroPress is incredibly versatile, but the 'standard' recipe often uses a 1:15 ratio (e.g., 15g coffee to 225g water). However, the original AeroPress method suggests creating a concentrate with a 1:6 ratio (approx. 16g coffee to the '1' mark on the tube) and then diluting it. Because the AeroPress uses both immersion and pressure, it can handle a wide range of ratios. For a clean, filter-style cup, 1:15 is best; for an espresso-style base for lattes, a tighter 1:4 to 1:6 ratio works perfectly."
  },
  {
    slug: "espresso-1-2-ratio-calculation",
    question: "How do I calculate the ratio for a 1:2 espresso shot?",
    answer: "To calculate a 1:2 espresso ratio, you simply double the weight of your dry coffee dose to find your target yield. If you put 18 grams of ground coffee into your portafilter, you should stop the shot when the liquid in your cup weighs 36 grams. This is measured using a small scale placed under the cup during extraction. The time it takes to reach this yield (usually 25-30 seconds) is then adjusted by changing the grind size, while the 1:2 ratio remains your fixed anchor for consistency."
  },
  {
    slug: "ristretto-vs-lungo-ratio",
    question: "What is a Ristretto ratio compared to Lungo?",
    answer: "A Ristretto is a 'short' shot, typically using a 1:1 to 1:1.5 ratio (e.g., 18g in, 18-27g out), resulting in an intense, syrupy, and less bitter flavor. A Lungo is a 'long' shot, using a 1:3 to 1:4 ratio (e.g., 18g in, 54-72g out), which is more diluted, higher in caffeine, and often brings out more bitter, woody notes. The 'Normale' sits in the middle at 1:2. Choosing between them allows you to emphasize either the intense sweetness (Ristretto) or the stretched-out flavor profile (Lungo) of a specific bean."
  },
  {
    slug: "water-temperature-influence-ratio",
    question: "How does water temperature influence the chosen ratio?",
    answer: "Water temperature acts as an extraction catalyst. Hotter water (205°F+) extracts faster and more thoroughly, meaning you can often use a slightly 'longer' ratio (like 1:17) without the coffee tasting weak. Cooler water (185°F-195°F) extracts more slowly, so you might prefer a 'shorter' ratio (like 1:15) to ensure the cup has enough body and strength. If you are forced to use cooler water (common with some office kettles), increasing your coffee-to-water ratio can help compensate for the lower extraction efficiency and prevent a thin-tasting brew."
  },
  {
    slug: "light-vs-dark-roast-ratio",
    question: "Can I use the same ratio for light and dark roasts?",
    answer: "While you can use the same ratio, you'll often get better results by adjusting. Dark roasts are more soluble and easier to extract, so they can sometimes taste overly bitter at a 1:17 ratio; a 1:15 ratio with slightly cooler water often works better. Light roasts are denser and harder to extract, so they benefit from a 1:17 or even 1:18 ratio with very hot water to help pull out the complex sugars and acidity. Experimenting with slightly more water for light roasts can help 'open up' the delicate flavor notes."
  },
  {
    slug: "bypass-method-coffee",
    question: "What is the 'Bypass' method in coffee brewing ratios?",
    answer: "The 'Bypass' method involves brewing a concentrated amount of coffee using a tight ratio (like 1:10) and then adding fresh, hot water (the bypass) to the final brew to reach a standard drinking strength (like 1:16). This is common in batch brewing to avoid over-extracting the grounds. By only running a portion of the water through the bed of coffee, you avoid pulling out the heavy, bitter tannins that come at the end of a long brew cycle, resulting in a cleaner and sweeter final cup."
  },
  {
    slug: "iced-coffee-hot-ratio",
    question: "How do I calculate the ratio for iced coffee (brewed hot)?",
    answer: "When brewing iced coffee hot (the Japanese Flash Chill method), you must account for the ice in your total water ratio. Typically, you replace 1/3 to 1/2 of your brewing water with ice in the carafe. For a 1:16 ratio for 500g total: use 30g coffee, 250g hot water for brewing, and 250g of ice in the vessel. The hot water extracts the coffee at a concentrated 1:8 ratio, and the ice immediately melts and dilutes it to the perfect 1:16 drinking strength while locking in the volatile aromatics."
  },
  {
    slug: "1-16-ratio-in-ounces",
    question: "What is the 1:16 ratio in ounces?",
    answer: "In ounces, a 1:16 ratio means approximately 0.6 ounces of coffee for every 10 ounces of water. Since one ounce of water is about 29.5 grams, and 10 ounces is 295 grams, dividing by 16 gives you 18.4 grams of coffee, which is roughly 0.65 ounces. Because ounces are a less precise unit of measurement for small quantities like coffee grounds, most enthusiasts prefer to switch to grams for the coffee weight while keeping ounces for the final volume of the water to ensure better accuracy."
  },
  {
    slug: "coffee-for-10-oz-mug",
    question: "How much coffee do I need for a 10 oz mug?",
    answer: "For a standard 10 oz (approx. 300ml) mug of coffee, you should use about 18 to 20 grams of coffee to hit a standard 1:15 or 1:16 ratio. If you are using tablespoons, this is roughly 3 level tablespoons of ground coffee. For a stronger cup, go with 20 grams; for a lighter, cleaner cup, 18 grams is ideal. Always remember to weigh your water as well, as a 10 oz mug filled to the brim might actually hold 11 or 12 ounces, which would require more coffee to maintain the ratio."
  },
  {
    slug: "sca-standard-coffee-ratio",
    question: "What is the SCA standard coffee brewing ratio?",
    answer: "The Specialty Coffee Association (SCA) 'Golden Cup Standard' specifies a ratio of 55 grams of coffee per liter of water, plus or minus 10%. This translates to a ratio between 1:16 and 1:18, with 1:18.18 being the exact center. This standard is designed to produce a brew with a Total Dissolved Solids (TDS) of 1.15% to 1.35% and an extraction yield of 18% to 22%. It is the benchmark against which professional coffee equipment and brewing techniques are evaluated globally to ensure quality and consistency."
  },
  {
    slug: "filter-type-affect-ratio",
    question: "How does the filter type affect the recommended ratio?",
    answer: "Filter types change the body and clarity, which affects how we perceive the ratio. Paper filters (V60, Chemex) remove oils and fines, creating a clean cup that often tastes best at 'longer' ratios like 1:17. Metal or cloth filters allow more oils and micro-particles to pass through, creating a heavier body. Because of this added 'weight' in the mouthfeel, these methods (like French Press or Kone filters) often feel more balanced with a 'shorter' ratio like 1:14 or 1:15 to support that increased texture and intensity."
  },
  {
    slug: "bloom-water-in-ratio",
    question: "Should I include the 'bloom' water in the total ratio?",
    answer: "Yes, the 'bloom' water (the initial small pour used to degas the coffee) must always be included in the total water weight for your ratio. For example, if your recipe calls for 300g of water for 20g of coffee (1:15), and you use 40g of water for the bloom, you have 260g of water remaining for the rest of your pours. Failing to include the bloom water would result in a 'longer' ratio than intended (1:17 in this case), leading to a weaker and potentially over-extracted cup of coffee."
  },
  {
    slug: "moka-pot-ratio",
    question: "What is the best ratio for a Moka Pot?",
    answer: "The Moka Pot is unique because the basket size determines the amount of coffee used. Generally, the ratio ends up being around 1:7 or 1:8. You should fill the basket to the top with coffee (level, not tamped) and the bottom chamber with water up to the safety valve. For a 3-cup Moka Pot, this usually means about 15-20g of coffee and 150ml of water. Since you can't easily change the ratio without affecting the pressure, focus on your grind size and starting water temperature to dial in the flavor."
  },
  {
    slug: "scale-coffee-recipe",
    question: "How do I scale a recipe for multiple people?",
    answer: "To scale a coffee recipe, maintain the same coffee-to-water ratio but increase the total weights proportionally. If your single-cup recipe is 20g coffee to 320g water (1:16) and you want to make three cups, multiply both numbers by three: 60g coffee to 960g water. Note that when scaling up pour-over methods, the larger bed of coffee will slow down the water flow, so you may need to use a slightly coarser grind to keep the total brew time within an acceptable range and avoid over-extraction."
  },
  {
    slug: "perfect-ratio-milk-drinks",
    question: "Is there a 'perfect' ratio for milk-based drinks?",
    answer: "For drinks like lattes, cappuccinos, or flat whites, the 'perfect' ratio is usually a concentrated one, between 1:1 and 1:2. Since milk adds significant volume, sweetness, and fat, the coffee base needs to be intense enough to 'cut through' the dairy. A standard 1:2 espresso shot is the gold standard. If you are using a drip brewer or French Press to make a 'coffee au lait,' try a very tight 1:10 ratio to create a concentrate that mimics the strength of espresso, ensuring the coffee flavor isn't lost in the milk."
  },
  {
    slug: "bean-age-affect-ratio",
    question: "How does the age of the coffee beans affect the ratio?",
    answer: "Fresh coffee beans (3-14 days post-roast) are full of CO2, which can resist water penetration and slow down extraction. Very fresh beans might benefit from a slightly 'longer' ratio or a longer bloom to ensure full saturation. Conversely, older beans (4+ weeks) have lost much of their gas and some of their structural integrity, making them more porous and easier to extract—but also more prone to tasting flat. For older beans, a 'shorter' ratio (e.g., 1:14) can help boost the body and preserve what remains of the coffee's flavor profile."
  },
  {
    slug: "chemex-ratio",
    question: "What is the ratio for a Chemex brew?",
    answer: "The Chemex typically performs best with a 1:16 to 1:17 ratio. Because Chemex filters are 20-30% thicker than standard filters, they remove almost all sediment and most oils, resulting in a very bright and clean cup. Using a 1:16 ratio (e.g., 30g coffee to 480g water) provides enough strength to balance the high clarity. If you use a ratio that is too long, the Chemex can produce a cup that feels thin or 'watery.' The 1:16 ratio ensures you get a clean cup that still has a satisfying presence."
  },
  {
    slug: "1-1-ratio-coffee-concentrate",
    question: "Can I use a 1:1 ratio for coffee concentrate?",
    answer: "A 1:1 ratio (equal parts coffee and water by weight) is rarely used for brewing because the coffee grounds will absorb almost all the water, leaving very little liquid to drink. In most brewing methods, coffee grounds retain about twice their weight in water. Therefore, a 1:1 'brew' would result in no yield. The strongest practical concentrates, like Ristretto espresso, use a 1:1 ratio where the high pressure 'forces' the liquid out. For cold brew or drip concentrates, the lowest practical ratio is usually 1:4 or 1:5."
  },
  {
    slug: "convert-ratio-to-percentage",
    question: "How do I convert a 1:15 ratio to a percentage?",
    answer: "To convert a ratio to a percentage, divide 1 by the second number and multiply by 100. For a 1:15 ratio, 1 divided by 15 equals 0.0666, which is 6.67%. This means your coffee grounds make up 6.67% of the total water weight. This is often called the 'dose percentage.' Understanding coffee in percentages is common in industrial brewing and can be helpful when comparing the concentration of different recipes across various volumes of water, as it provides a universal language for brew strength."
  },
  {
    slug: "strength-vs-extraction-ratio",
    question: "What is the 'strength' vs 'extraction' in coffee ratios?",
    answer: "Strength (TDS) is the concentration of coffee solids in your cup—it's how 'strong' or 'watery' the coffee feels. Extraction is the percentage of the grounds that were dissolved. Your ratio is the primary tool for adjusting strength; more coffee per water equals more strength. However, you can have a very strong cup (low ratio) that is under-extracted (sour because the water didn't stay in contact long enough). Conversely, you can have a weak cup (high ratio) that is over-extracted (bitter because the water pulled out everything it could). Ratio manages strength, while grind/time manages extraction."
  },
  {
    slug: "grams-coffee-6-oz-cup",
    question: "How many grams of coffee per cup of water (6 oz)?",
    answer: "A standard 6 oz 'cup' of water is about 177ml. Using a 1:16 ratio, you would need approximately 11 grams of coffee. If you use the common '2 tablespoons per 6 oz' rule, you are likely using between 10g and 14g depending on the bean. For most people, 11-12 grams of coffee per 6 oz cup provides a balanced and flavorful experience. If you find this too weak, bumping it up to 13 grams (a 1:13.6 ratio) will provide a more traditional, robust American 'diner-style' strength."
  },
  {
    slug: "turkish-coffee-ratio",
    question: "What is the ratio for Turkish coffee?",
    answer: "Turkish coffee uses an extremely fine, flour-like grind and a very tight ratio, typically around 1:10. This usually means 7 to 10 grams of coffee for every 70 to 100ml of water. Because the coffee is not filtered, the 'ratio' includes the grounds that remain in the bottom of the cup. This high ratio, combined with the fine grind and the unique boiling process in a cezve (ibrik), creates a thick, foamy, and highly intense beverage that is traditionally served with a glass of water to cleanse the palate."
  },
  {
    slug: "altitude-affect-brewing-ratio",
    question: "How does altitude affect coffee brewing ratios?",
    answer: "Altitude affects the boiling point of water; at high altitudes, water boils at a lower temperature (e.g., 198°F in Denver vs 212°F at sea level). Since cooler water extracts more slowly, you might find that your standard 1:17 ratio tastes weak or sour at high altitudes. To compensate, many people use a 'shorter' ratio (like 1:15) or a finer grind to increase the extraction efficiency. You are essentially using more coffee or more surface area to make up for the lack of heat energy available to dissolve the coffee solids."
  },
  {
    slug: "why-prefer-1-18-ratio",
    question: "Why do some people prefer a 1:18 ratio?",
    answer: "A 1:18 ratio is favored by those who enjoy 'high extraction' brewing, particularly with light-roasted, high-quality specialty coffees. This 'longer' ratio uses more water to pull out as much complexity and sweetness as possible from the bean. When paired with a precise grind and good water chemistry, a 1:18 ratio can produce a cup that is incredibly sweet, vibrant, and transparent, allowing you to taste the specific terroir of the coffee. It is a favorite among baristas competing in Brewers Cup competitions where clarity is king."
  },
  {
    slug: "clever-dripper-ratio",
    question: "What is the best ratio for a Clever Dripper?",
    answer: "The Clever Dripper is a hybrid of immersion and percolation, usually performing best at a 1:15 or 1:16 ratio. Because the coffee steeps (immersion) before being filtered, it gains a fuller body than a standard pour-over. A 1:15 ratio (e.g., 20g coffee to 300g water) highlights this texture. To use it, add your coffee, then water, steep for 2-3 minutes, then place it on your mug. The immersion phase ensures an even extraction, while the paper filter provides a clean finish that works beautifully with mid-range ratios."
  },
  {
    slug: "metal-mesh-filter-ratio",
    question: "How do I adjust the ratio for a metal mesh filter?",
    answer: "Metal mesh filters allow more oils and fine particles (fines) into the cup compared to paper. This results in a much heavier mouthfeel and more perceived 'strength.' To keep the cup from feeling overly muddy or overwhelming, many people prefer to use a slightly 'longer' ratio, such as 1:17 or 1:18, when using metal filters like the Able Kone or a French Press. This extra water helps to provide clarity and balance to the rich, oily texture that the metal mesh naturally provides to the brew."
  },
  {
    slug: "vietnamese-drip-coffee-ratio",
    question: "What is the ratio for Vietnamese drip coffee?",
    answer: "Vietnamese drip coffee (Cà Phê Phin) uses a small metal filter called a Phin and a very tight ratio, often around 1:4 to 1:6. A typical recipe might use 20g of coarse-ground coffee (usually a dark roast with chicory) to just 100ml of water. This creates an extremely strong, slow-dripping concentrate. The intensity is intentional, as it is designed to be mixed with a generous amount of sweetened condensed milk and poured over ice, which dilutes the coffee to a palatable and delicious drinking strength."
  },
  {
    slug: "coffee-soda-ratio",
    question: "Can I use a ratio to make coffee soda?",
    answer: "To make coffee soda, you first need a coffee concentrate, usually brewed at a 1:4 or 1:5 ratio (like cold brew concentrate). You then use a 'dilution ratio' to mix it with sparkling water. A common ratio is 1 part coffee concentrate to 2 or 3 parts sparkling water. For example, 50ml of concentrate and 150ml of soda water. The goal is to maintain a ratio that is strong enough to keep its character when carbonated, as the CO2 bubbles can often mask the more subtle flavor notes of the coffee."
  },
  {
    slug: "water-mineral-content-ratio",
    question: "How does the water's mineral content affect the ratio?",
    answer: "Water mineral content (magnesium, calcium, and bicarbonate) is what actually 'grabs' the flavor compounds from the coffee. If your water is too soft (distilled or reverse osmosis), it won't extract well, and your standard 1:16 ratio might taste flat and sour. If your water is too hard, it can over-extract and taste chalky or bitter. While ratio can help—using a 'shorter' ratio with hard water or a 'longer' ratio with soft water—fixing your water chemistry is usually more effective than trying to compensate with more or less coffee."
  },
  {
    slug: "kalita-wave-ratio",
    question: "What is the ratio for a Kalita Wave?",
    answer: "The Kalita Wave, known for its flat-bottom design and three small holes, is very forgiving and usually tastes best at a 1:16 ratio. This design promotes a very even extraction across the coffee bed. A standard recipe of 18.5g of coffee to 300g of water (1:16.2) is a popular starting point. Because it extracts so evenly, you can also push it to 1:17 to get more clarity without risking the 'channeling' (uneven water flow) that can sometimes happen with V-shaped drippers at longer ratios."
  },
  {
    slug: "32-oz-french-press-ratio",
    question: "How do I calculate the ratio for a 32 oz French Press?",
    answer: "A 32 oz French Press holds about 946ml of water. To use a classic 1:15 French Press ratio, divide 946 by 15, which gives you approximately 63 grams of coffee. If you prefer a slightly lighter 1:16 ratio, you would use 59 grams. Using a scale is vital here; if you were to use scoops, you would need about 9 to 12 tablespoons depending on the roast. For the most consistent results, weigh out 60g of coffee and fill the press with 900g of water."
  },
  {
    slug: "ratio-caffeine-content",
    question: "What is the relationship between ratio and caffeine content?",
    answer: "Caffeine is highly soluble and is extracted early in the brewing process. Therefore, the total amount of caffeine in your cup is primarily determined by the total amount of coffee grounds used, rather than the ratio. For example, a 1:10 'concentrate' and a 1:18 'long brew' both using 20g of the same coffee will have roughly the same amount of caffeine. However, because you might drink *more* of a 1:18 brew than a 1:10 shot, the total caffeine consumption per session can vary based on the final volume."
  },
  {
    slug: "hario-switch-ratio",
    question: "What is the best ratio for the Hario Switch?",
    answer: "The Hario Switch is a hybrid brewer that allows for both immersion and percolation. For a standard hybrid brew (immersion followed by a draw-down), a 1:15 or 1:16 ratio works best. This provides the full-bodied sweetness characteristic of immersion brewing while maintaining the clarity of a paper filter. If you use it purely for immersion, you might prefer a tighter 1:14 ratio to emphasize the rich texture. The versatility of the Switch means you can experiment with different ratios to find the perfect balance between body and brightness."
  },
  {
    slug: "origami-dripper-ratio",
    question: "What ratio should I use for an Origami Dripper?",
    answer: "The Origami Dripper's unique design, featuring deep vertical grooves, allows for excellent airflow and a fast draw-down. Because of this, it performs exceptionally well with 'longer' ratios like 1:17 or even 1:18. These ratios highlight the vibrant acidity and floral notes of light-roasted specialty coffees. Using a 1:17 ratio (e.g., 18g coffee to 306g water) ensures that the water can flow freely through the grounds without clogging, resulting in a clean, sweet cup that celebrates the dripper's ability to produce high clarity and bright flavors."
  },
  {
    slug: "inverted-aeropress-ratio",
    question: "Does the ratio change for the Inverted AeroPress method?",
    answer: "While the standard 1:15 ratio is a great starting point for both methods, the inverted AeroPress technique often benefits from a slightly 'shorter' ratio like 1:13 or 1:14. Because the inverted method allows for a longer total immersion time without any early leakage, it produces a more intense, full-bodied cup. A tighter ratio complements this intensity, resulting in a rich, syrupy mouthfeel that is perfect for those who enjoy a more concentrated coffee experience. Many competition-winning inverted recipes use these shorter ratios to maximize flavor impact and sweetness."
  },
  {
    slug: "cold-brew-french-press-ratio",
    question: "What is the ratio for making cold brew in a French Press?",
    answer: "Using a French Press for cold brew is highly convenient. A ratio of 1:7 or 1:8 (coffee to water by weight) is ideal for creating a concentrate that is versatile and flavorful. For a standard 34 oz French Press, use about 120g of coarsely ground coffee and 840g of cold, filtered water. Steep for 12-24 hours at room temperature or in the fridge. The French Press's metal filter allows some oils to pass through, giving your cold brew a rich, smooth body that pairs perfectly with milk or can be diluted with water."
  },
  {
    slug: "percolator-coffee-ratio",
    question: "What is the recommended ratio for a coffee percolator?",
    answer: "Percolators are known for producing hot, robust coffee, often with a slightly more 'boiled' flavor profile. A standard ratio of 1:16 (roughly 1 tablespoon per 5 oz of water) is recommended to prevent the coffee from becoming overly bitter. Because percolators cycle the brewed coffee back over the grounds multiple times, over-extraction is a common risk. Using a coarser grind and a slightly lighter ratio can help mitigate this, resulting in a cup that is strong and full-bodied without being harsh or unpleasantly astringent."
  },
  {
    slug: "pour-over-1-cup-ratio",
    question: "What is the best ratio for brewing a single cup of pour-over?",
    answer: "Brewing a single cup (approx. 250g of water) requires precision, as small errors in weight have a larger impact. A 1:15 or 1:16 ratio is ideal for a single cup. For example, using 16g of coffee to 250g of water (1:15.6) provides a balanced and flavorful experience. When brewing small volumes, heat retention is more challenging, so ensuring your brewer and mug are well-preheated is vital. A slightly finer grind may also be necessary compared to larger batches to maintain an appropriate total brew time and ensure full extraction."
  },
  {
    slug: "automatic-drip-batch-ratio",
    question: "How do I adjust the ratio for large batch automatic drip brewing?",
    answer: "For large batches (e.g., 2 liters or more), a slightly 'longer' ratio like 1:17 or 1:18 is often used to prevent the brew from becoming too heavy or over-extracted. As the bed of coffee becomes deeper, the water takes longer to pass through, which increases contact time. To compensate, using a slightly coarser grind and more water relative to the coffee grounds helps maintain a clean, balanced flavor. A ratio of 55-60g of coffee per liter is a standard benchmark for commercial batch brewers to ensure consistency and quality."
  },
  {
    slug: "ratio-for-oily-dark-roast",
    question: "What is the best ratio for very oily, dark-roasted beans?",
    answer: "Dark-roasted beans that are oily on the surface are highly soluble and extract very quickly. To avoid excessive bitterness and a 'burnt' taste, a 'shorter' ratio of 1:13 or 1:14 is often preferred. Using less water and a slightly cooler brewing temperature (around 88°C - 90°C) helps to emphasize the sweet, chocolatey, and smoky notes without pulling out the harsh, carbonized flavors. This tighter ratio also enhances the body, which is one of the primary reasons many coffee drinkers enjoy darker roasts in the first place."
  },
  {
    slug: "best-ratio-for-iced-pour-over",
    question: "What is the ideal ratio for an iced pour-over (Flash Chill)?",
    answer: "The 'Flash Chill' method involves brewing hot coffee directly onto ice. To maintain the correct final strength, you must account for the ice in your total water weight. A common ratio is 1:15 total, with 40% of the water weight replaced by ice. For example, to make 300g of iced coffee, use 20g of coffee, 180g of hot water for brewing, and 120g of ice in the carafe. This concentrated hot brew extracts the full flavor, which is then immediately chilled and diluted to the perfect drinking strength as the ice melts."
  },
  {
    slug: "ratio-for-cold-drip-coffee",
    question: "What is the recommended ratio for cold drip coffee?",
    answer: "Cold drip coffee (Kyoto style) typically uses a ratio of 1:10 to 1:12. Unlike immersion cold brew, it relies on water slowly dripping through a bed of coffee over 4 to 12 hours. This produces a highly concentrated, smooth, and aromatic spirit-like coffee that is less acidic and has a clean, complex body. It is usually served cold, neat, or over a large ice sphere to enjoy its nuanced flavor profile."
  }
];
