const API_URL = "https://fakestoreapi.com/products";


document.addEventListener("DOMContentLoaded", () => {
    
    if (document.getElementById('products-container')) {
        loadCategories();
        loadProductsByCategory('all'); 
    }
    
    if (document.getElementById('trending-container')) {
        loadTrending();
    }
});


const loadCategories = () => {
    const container = document.getElementById('category-container');
    if (!container) return;

    fetch(`${API_URL}/categories`)
        .then(res => res.json())
        .then(categories => {
            categories.forEach(category => {
                const btn = document.createElement('button');
                btn.className = "btn btn-outline btn-ghost border-gray-200 rounded-full px-6 capitalize font-medium text-gray-600 hover:btn-primary";
                btn.innerText = category;
                btn.onclick = () => loadProductsByCategory(category);
                container.appendChild(btn);
            });
        });
};


const loadProductsByCategory = (category) => {
    const container = document.getElementById('products-container');
    container.innerHTML = '<div class="col-span-full text-center py-20"><span class="loading loading-spinner loading-lg text-primary"></span></div>';

    
    const url = category === 'all' ? API_URL : `${API_URL}/category/${category}`;

    fetch(url)
        .then(res => res.json())
        .then(data => displayCards(data, 'products-container'))
        .catch(err => console.error("Error:", err));
};


const loadTrending = () => {
    fetch(`${API_URL}?limit=3`)
        .then(res => res.json())
        .then(data => displayCards(data, 'trending-container'));
};


const displayCards = (products, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ""; 

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = "card bg-base-100 shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300";
        card.innerHTML = `
            <figure class="bg-gray-50 rounded-2xl py-6 h-64 mb-4 flex justify-center items-center">
                <img src="${product.image}" alt="${product.title}" class="h-full object-contain mix-blend-multiply" />
            </figure>
            <div class="space-y-2">
                <div class="flex justify-between items-center text-[11px] font-bold uppercase text-gray-400">
                    <span>${product.category}</span>
                    <div class="flex items-center gap-1 text-yellow-500">
                        <span>★</span>
                        <span class="text-gray-500">${product.rating.rate} (${product.rating.count})</span>
                    </div>
                </div>
                <h2 class="font-bold text-gray-800 text-sm line-clamp-1" title="${product.title}">${product.title}</h2>
                <p class="text-blue-700 font-extrabold text-lg">$${product.price}</p>
                <div class="flex gap-2 pt-2">
                    <button onclick="loadDetails(${product.id})" class="btn btn-outline btn-sm flex-1 rounded-lg border-gray-200 text-gray-600 hover:bg-gray-100">Details</button>
                    <button class="btn btn-primary btn-sm flex-1 rounded-lg shadow-md shadow-blue-100">Add</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
};


const loadDetails = (id) => {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(data => {
            const modalContent = document.getElementById('modal-content');
            modalContent.innerHTML = `
                <div class="flex flex-col lg:flex-row gap-8 items-center p-6 text-left">
                    <div class="w-full lg:w-1/2 bg-gray-50 p-6 rounded-3xl flex justify-center">
                        <img src="${data.image}" class="max-h-72 object-contain" />
                    </div>
                    <div class="w-full lg:w-1/2 space-y-4">
                        <span class="badge badge-primary badge-outline capitalize font-semibold">${data.category}</span>
                        <h2 class="text-2xl font-bold text-gray-900 leading-tight">${data.title}</h2>
                        <div class="flex items-center gap-2">
                           <span class="text-yellow-500 font-bold text-lg">★ ${data.rating.rate}</span>
                           <span class="text-gray-400 text-sm">(${data.rating.count} reviews)</span>
                        </div>
                        <p class="text-gray-500 text-sm leading-relaxed">${data.description}</p>
                        <p class="text-3xl font-black text-blue-700">$${data.price}</p>
                        <button class="btn btn-primary btn-block h-12 rounded-xl text-md shadow-lg shadow-blue-100">Buy Now</button>
                    </div>
                </div>
            `;
            document.getElementById('product_modal').showModal();
        });
};