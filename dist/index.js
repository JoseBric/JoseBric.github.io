Object.defineProperty(exports, "__esModule", { value: true });
const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "https://api.escuelajs.co/api/v1/products";
const PAGINATION_KEY = "pagination";
const INITIAL_PRODUCTS_OFFSET = 5;
const PRODUCTS_PER_REQUEST = 10;
const MAX_PRODUCTS = 200;
let isLoadingProducts = false;
const intersectionObserver = new IntersectionObserver((entries) => {
    const [target] = entries;
    if (!target?.isIntersecting)
        return;
    loadData();
}, {
    rootMargin: "0px 0px 100% 0px",
});
const getPagination = () => {
    return Number(localStorage.getItem(PAGINATION_KEY));
};
const storePagination = (pagination) => {
    localStorage.setItem(PAGINATION_KEY, pagination.toString());
};
const clearLocalStorage = () => {
    localStorage.clear();
};
const calcOffset = (page, initialOffset, itemsPerPage) => {
    return initialOffset + page * itemsPerPage;
};
const renderItem = (products) => {
    const output = products.map(({ images, title, price }) => {
        return `
      <article class="Card">
        <img src="${images[0]}" alt="${title} product" />
        <h2>
        ${title}
          <small>$${price}</small>
        </h2>
      </article>`;
    });
    const newItem = document.createElement("section");
    newItem.classList.add("Item");
    newItem.innerHTML = output.join(`<br />`);
    $app.appendChild(newItem);
};
const renderEmptyProductsMessage = () => {
    const message = document.createElement("p");
    message.innerText = "Todos los productos Obtenidos";
    $app.appendChild(message);
};
const getData = async (api, offset, limit) => {
    try {
        const res = await fetch(`${api}?offset=${offset}&limit=${limit}`);
        const products = await res.json();
        renderItem(products);
    }
    catch (e) {
        console.error(e);
    }
};
const loadData = async () => {
    try {
        if (isLoadingProducts)
            return;
        isLoadingProducts = true;
        const pagination = getPagination();
        const offset = calcOffset(pagination, INITIAL_PRODUCTS_OFFSET, PRODUCTS_PER_REQUEST);
        const newPagination = pagination + 1;
        storePagination(newPagination);
        console.log({ offset });
        await getData(API, offset, PRODUCTS_PER_REQUEST);
        const maxPage = MAX_PRODUCTS / PRODUCTS_PER_REQUEST;
        const hasReachedMax = newPagination >= maxPage;
        if (hasReachedMax) {
            renderEmptyProductsMessage();
            intersectionObserver.disconnect();
        }
    }
    catch (e) {
        console.log(e);
    }
    finally {
        isLoadingProducts = false;
    }
};
intersectionObserver.observe($observe);
clearLocalStorage();
//# sourceMappingURL=index.js.map