import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "./App.jsx";
import menu from "./data/menu.js";

// MemoryRouter is a router that keeps the "address" in memory, so tests can
// start at any URL. The real app uses BrowserRouter (see main.jsx).
function renderAt(url) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>
  );
}

const navbar = () => within(document.querySelector("nav"));

describe("Routes: the URL decides which page is drawn", () => {
  it("/ shows the Home page", () => {
    renderAt("/");
    expect(screen.getByText(/Welcome to Tasty Bites/)).toBeInTheDocument();
  });

  it("/menu shows the Menu page with eight cards", () => {
    const { container } = renderAt("/menu");
    expect(screen.getByRole("heading", { name: "Our Menu" })).toBeInTheDocument();
    expect(container.querySelectorAll(".card").length).toBe(menu.length);
  });

  it("/contact shows the Contact page", () => {
    renderAt("/contact");
    expect(screen.getByRole("heading", { name: "Contact us" })).toBeInTheDocument();
  });
});

describe("Layout and Outlet: shared navbar and footer", () => {
  it.each(["/", "/menu", "/contact", "/menu/3", "/nothing-here"])(
    "%s has the navbar and the footer",
    (url) => {
      renderAt(url);
      expect(navbar().getByText(/Tasty Bites/)).toBeInTheDocument();
      expect(screen.getByText(/Like us/)).toBeInTheDocument();
    }
  );
});

describe("Link and NavLink", () => {
  it("clicking navbar links changes the page", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(navbar().getByRole("link", { name: "Menu" }));
    expect(screen.getByRole("heading", { name: "Our Menu" })).toBeInTheDocument();
    await user.click(navbar().getByRole("link", { name: "Contact" }));
    expect(screen.getByRole("heading", { name: "Contact us" })).toBeInTheDocument();
    await user.click(navbar().getByRole("link", { name: "Home" }));
    expect(screen.getByText(/Welcome to Tasty Bites/)).toBeInTheDocument();
  });

  it("the Link button on the Home page opens the menu", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(screen.getByRole("link", { name: "See the menu" }));
    expect(screen.getByRole("heading", { name: "Our Menu" })).toBeInTheDocument();
  });

  it("NavLink gives the current page's link the 'active' class", () => {
    renderAt("/contact");
    expect(navbar().getByRole("link", { name: "Contact" })).toHaveClass("active");
    expect(navbar().getByRole("link", { name: "Menu" })).not.toHaveClass("active");
    expect(navbar().getByRole("link", { name: "Home" })).not.toHaveClass("active");
  });

  it("Home is active only on / (because of the 'end' prop)", () => {
    renderAt("/");
    expect(navbar().getByRole("link", { name: "Home" })).toHaveClass("active");
    expect(navbar().getByRole("link", { name: "Menu" })).not.toHaveClass("active");
  });

  it("Menu stays active on a dish page (/menu/3)", () => {
    renderAt("/menu/3");
    expect(navbar().getByRole("link", { name: "Menu" })).toHaveClass("active");
  });
});

describe("useParams: /menu/:id", () => {
  it("/menu/3 shows Masala Dosa", () => {
    renderAt("/menu/3");
    expect(screen.getByRole("heading", { name: "Masala Dosa" })).toBeInTheDocument();
    expect(screen.getByText("₹90")).toBeInTheDocument();
  });

  it("/menu/7 shows Chocolate Shake", () => {
    renderAt("/menu/7");
    expect(screen.getByRole("heading", { name: "Chocolate Shake" })).toBeInTheDocument();
  });

  it("an id that does not exist shows a friendly message", () => {
    renderAt("/menu/99");
    expect(screen.getByText(/There is no dish with id 99/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to the menu" })).toBeInTheDocument();
  });

  it("an id that is not a number also shows the message", () => {
    renderAt("/menu/pizza");
    expect(screen.getByText(/There is no dish with id pizza/)).toBeInTheDocument();
  });

  it("'View details' on a card opens that dish's page", async () => {
    const user = userEvent.setup();
    renderAt("/menu");
    const links = screen.getAllByRole("link", { name: "View details" });
    expect(links.length).toBe(menu.length);
    await user.click(links[3]);
    expect(screen.getByRole("heading", { name: "Chicken Biryani" })).toBeInTheDocument();
  });

  it("'Back to the menu' returns to the menu", async () => {
    const user = userEvent.setup();
    renderAt("/menu/2");
    await user.click(screen.getByRole("link", { name: /Back to the menu/ }));
    expect(screen.getByRole("heading", { name: "Our Menu" })).toBeInTheDocument();
  });
});

describe("path='*': page not found", () => {
  it("an unknown URL shows the 404 page", () => {
    renderAt("/pizza-party");
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/could not find that page/)).toBeInTheDocument();
  });

  it("the 404 page's link goes home", async () => {
    const user = userEvent.setup();
    renderAt("/oops");
    await user.click(screen.getByRole("link", { name: /Go to the home page/ }));
    expect(screen.getByText(/Welcome to Tasty Bites/)).toBeInTheDocument();
  });
});

describe("What survives a page change (the teaching moment)", () => {
  it("the footer Like count survives, because Layout stays on screen", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(screen.getByRole("button", { name: /Like us/ }));
    await user.click(screen.getByRole("button", { name: /Like us/ }));
    expect(screen.getByRole("button", { name: /Like us \(2\)/ })).toBeInTheDocument();
    await user.click(navbar().getByRole("link", { name: "Menu" }));
    await user.click(navbar().getByRole("link", { name: "Contact" }));
    expect(screen.getByRole("button", { name: /Like us \(2\)/ })).toBeInTheDocument();
  });

  it("the Contact note is forgotten when you leave the page", async () => {
    const user = userEvent.setup();
    renderAt("/contact");
    await user.type(screen.getByLabelText("Leave us a note"), "Table for four");
    expect(screen.getByLabelText("Leave us a note")).toHaveValue("Table for four");
    await user.click(navbar().getByRole("link", { name: "Menu" }));
    await user.click(navbar().getByRole("link", { name: "Contact" }));
    expect(screen.getByLabelText("Leave us a note")).toHaveValue("");
  });

  it("a card's 'Added' count is forgotten after visiting its dish page", async () => {
    const user = userEvent.setup();
    renderAt("/menu");
    await user.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    expect(screen.getByText("Added: 1")).toBeInTheDocument();
    await user.click(screen.getAllByRole("link", { name: "View details" })[0]);
    await user.click(screen.getByRole("link", { name: /Back to the menu/ }));
    expect(screen.queryByText(/Added:/)).not.toBeInTheDocument();
  });
});

describe("Menu page still has its Session 17 features", () => {
  it("search filters the cards", async () => {
    const user = userEvent.setup();
    const { container } = renderAt("/menu");
    await user.type(screen.getByPlaceholderText("Search dishes..."), "PIZZA");
    expect(container.querySelectorAll(".card").length).toBe(1);
  });

  it("each card counts its own clicks", async () => {
    const user = userEvent.setup();
    renderAt("/menu");
    const buttons = screen.getAllByRole("button", { name: "Add to cart" });
    await user.click(buttons[0]);
    await user.click(buttons[0]);
    const cards = document.querySelectorAll(".card");
    expect(within(cards[0]).getByText("Added: 2")).toBeInTheDocument();
    expect(within(cards[1]).queryByText(/Added:/)).not.toBeInTheDocument();
  });
});
