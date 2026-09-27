import { fetchPizzaCatalog, groupPizzasByCategory } from "@/lib/api";
import { PIZZA_CATEGORIES, PIZZA_CATEGORY_LABELS } from "@/lib/constants";
import { PizzaCard } from "@/components/pizza-card";
import { PizzaBanner } from "@/components/pizza-banner";

export default async function Home() {
  const pizzas = await fetchPizzaCatalog();
  const groups = groupPizzasByCategory(pizzas);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-8 lg:px-10 lg:pb-25.5">
      {PIZZA_CATEGORIES.map((category) => {
        const items = groups[category];

        if (items.length === 0) {
          return null;
        }

        const isPizza = category === "pizza";

        return (
          <section key={category} id={category} className="mb-16 scroll-mt-24 lg:mb-12">
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

                {/* Desktop: promo row (featured + 3 cards + banner, uncapped
                    so all 5 fit on one line) then a max-w-[832px] grid below
                    that fits exactly 4 regular cards per row. */}
                <div className="hidden lg:flex lg:flex-wrap lg:items-start lg:gap-8">
                  {items.slice(0, 4).map((pizza, index) => (
                    <PizzaCard
                      key={pizza._id}
                      pizza={pizza}
                      featured={index === 0}
                    />
                  ))}
                  <PizzaBanner />
                </div>
                {items.length > 4 && (
                  <div className="hidden lg:mt-8 lg:flex lg:max-w-[832px] lg:flex-wrap lg:gap-8">
                    {items.slice(4).map((pizza) => (
                      <PizzaCard key={pizza._id} pizza={pizza} />
                    ))}
                  </div>
                )}
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
  );
}
