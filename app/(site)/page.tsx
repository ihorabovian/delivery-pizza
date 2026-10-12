import { fetchPizzaCatalog, groupPizzasByCategory } from "@/lib/api";
import { PIZZA_CATEGORIES, PIZZA_CATEGORY_LABELS } from "@/lib/constants";
import { PizzaCard } from "@/components/pizza-card";
import { PizzaBanner } from "@/components/pizza-banner";

export default async function Home() {
  const pizzas = await fetchPizzaCatalog();
  const groups = groupPizzasByCategory(pizzas);

  return (
    <div className="page-container py-10 lg:flex lg:items-start lg:gap-8 lg:pb-25.5">
      <div className="min-w-0 lg:w-[832px] lg:shrink-0">
        {PIZZA_CATEGORIES.map((category) => {
          const items = groups[category];

          if (items.length === 0) {
            return null;
          }

          const isPizza = category === "pizza";

          return (
            <section
              key={category}
              id={category}
              className="mb-16 scroll-mt-[var(--header-height)] lg:mb-12"
            >
              <h2 className="mb-6 hidden text-2xl font-semibold sm:block">
                {PIZZA_CATEGORY_LABELS[category]}
              </h2>
              {isPizza ? (
                <>
                  {/* Mobile/tablet: one continuous grid so odd-numbered rows
                    never strand a lone card (the banner stays lg-only). */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:hidden">
                    {items.map((pizza, index) => (
                      <PizzaCard
                        key={pizza._id}
                        pizza={pizza}
                        featured={index === 0}
                      />
                    ))}
                  </div>

                  {/* Desktop: 4 cards per row; the banner lives in its own
                    sticky column next to the catalog. */}
                  <div className="hidden lg:flex lg:flex-wrap lg:gap-8">
                    {items.map((pizza, index) => (
                      <PizzaCard
                        key={pizza._id}
                        pizza={pizza}
                        featured={index === 0}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:flex lg:max-w-[832px] lg:flex-wrap lg:gap-8">
                  {items.map((pizza) => (
                    <PizzaCard key={pizza._id} pizza={pizza} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Sticks under the header while the catalog scrolls. Top margin lines
          it up with the first row of cards, below the section heading. */}
      <aside className="hidden lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:mt-14 lg:block">
        <PizzaBanner />
      </aside>
    </div>
  );
}
