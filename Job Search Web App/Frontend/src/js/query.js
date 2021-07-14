import { extractFormData } from "./extract";
import { jobTemplate } from "./template";

export class jobFinder {
    constructor(
        searchFormSelector,
        loaderSelector,
        jobQuerySelector
    ) {
        this.searchForm = document.querySelector(searchFormSelector);
        this.loader = document.querySelector(loaderSelector);
        this.jobQuery = document.querySelector(jobQuerySelector);
    }

    configureFormListener() {
        this.searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.jobQuery.innerHTML = "";

            const { search, location, country } = extractFormData(this.searchForm);

            this.startLoadSpinner(); 
 
            fetch(`http://localhost:60/?search=${search}&location=${location}&country=${country}`)
                .then((response) => response.json())
                .then(({ results }) => {
                    this.stopLoadSpinner();
                    
                    return results
                              .map((job) => jobTemplate(job)
                              .join(""); 
                })
                .then((jobs) => this.jobQuery.innerHTML = jobs)
                .catch(() => this.stopLoadSpinner());
        });
    }

    startLoadSpinner() {
        this.loader.classList.add("load");        
    }

    stopLoadSpinner() {
        this.loader.classList.remove("load");
    }
}
