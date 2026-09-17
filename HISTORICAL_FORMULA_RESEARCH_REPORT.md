# Historical Formula Research Report

Reviewed: September 17, 2026

## Current result

The archive contains 942 entries. This first safety-screened formula release adds 2 primary-source formulas with measured quantities and complete preparation methods:

| Entry | Historical source | Result |
| --- | --- | --- |
| Barley Water | *The New Royal Cook Book* (Royal Baking Powder Co., 1920), p. 45 | Exact American period formula added |
| Arrowroot Starch | May Henry and Edith B. Cohen, *The Economical Jewish Cook*, 3rd ed. (1897), p. 67 | Exact period method added; source does not independently verify the entry’s American cultural attribution |

The remaining 940 entries do not yet display a measured formula. Their existing descriptive methods remain unchanged. A missing formula is not filled with an estimate, an invented quantity, or a modern recipe presented as historical.

## Publication gate

A formula is displayed only when all of the following are true:

1. A real primary historical source gives measurable quantities and a complete process.
2. The source is linked and identified by title, author or publisher, year, and page.
3. The source’s actual scope is stated. A matching method does not automatically verify a community attribution, medicinal claim, or effectiveness.
4. The preparation has no identified poisonous, caustic, narcotic, abortifacient, toxic-dose, or similarly serious hazard.
5. A modern authoritative source supports each material food-safety warning.
6. The method is written in the past tense as an archive record, not as treatment advice.

A disclaimer is not used to excuse an unsafe formula. Hazardous preparations remain archive-only without actionable measurements.

## Safety screening

- 441 of the 942 existing entries already carry a caution. The validator prevents this first formula data set from attaching a formula to any cautioned entry.
- A blocked-ingredient check rejects several clear high-risk substances before a formula can be accepted.
- Each accepted formula requires at least two measured ingredients, a complete recorded method, a primary-source link, safety notes, and at least one modern safety source.
- The app labels every displayed formula “Documented historical formula” and states that it is neither a recommendation nor a treatment instruction.

## Deliberate exclusions from this release

- Raw or inadequately heated meat preparations were excluded.
- Calf’s-foot jelly was not included because the period source calls for raw egg whites and shells, and its safe modernization would no longer be the exact historical formula.
- Chicken broth was not included because the located period source says only to cover the bird with water; it does not provide a measured water quantity.
- Tinctures, concentrated extracts, medicinal dosing, and formulas involving entries with known cautions remain excluded pending individual toxicology and interaction review.

## Sources used in this release

### Primary historical sources

- [*The New Royal Cook Book* (1920), Barley Water, p. 45](https://www.gutenberg.org/files/38193/38193-h/38193-h.htm#Page_45)
- [May Henry and Edith B. Cohen, *The Economical Jewish Cook*, 3rd ed. (1897), Cup of Arrowroot, p. 67](https://www.gutenberg.org/files/54045/54045-h/54045-h.htm#Page_67)

### Modern safety sources

- [NIDDK: Eating, Diet, & Nutrition for Celiac Disease](https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/eating-diet-nutrition)
- [CDC: Raw Milk](https://www.cdc.gov/food-safety/foods/raw-milk.html)
- [CDC: About Infant and Toddler Nutrition](https://www.cdc.gov/infant-toddler-nutrition/about/index.html)
- [CDC: Cow's Milk and Milk Alternatives](https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/cows-milk-and-milk-alternatives.html)
- [FoodSafety.gov: Food Safety and Eating Out](https://www.foodsafety.gov/blog/food-safety-and-eating-out)

## Verification command

Run `npm run validate:formulas` to check formula-to-entry links, duplicate records, measured amounts, source URLs, safety-source coverage, caution exclusions, and blocked ingredients.
