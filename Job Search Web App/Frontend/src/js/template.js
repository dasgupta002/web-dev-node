export const jobTemplate = (job) => `
    <div class = "card mb-4">
       <div class = "card-body">
          <div class = "card-title">
             <h2>${job.title} up to ${job.salary_max}</h2>
          </div>
          <div class = "card-subtitle">   
             <h3>${job.location.display_name}</h3>
          </div>
          <p class = "card-text">
            ${job.description}
          </p>
          <a class = "btn btn-dark" href = "${job.redirect_url}" target = "_blank">Apply Now</a>
       </div>
    </div>
`;