# Apple-care

<a href="https://apple-care.onrender.com/">Click here to view LIVE version</a>

This project is a Point Of Sale system (POS) and inventory tracker for an Apple products (iPhones, iPads, Macbooks, etc.) dealership.<br>
You can customize the code base of this project to meet your needs. (I'll try my best to add more comments to the codes, my bad 🥲). <br>
This is a full stack Javascript project, and hence just a fair knowledge of javascript is enough to understand the codebase.<br>
NB: Tech Stack : <b>Node JS, Express JS, MongoDB, ejs template</b>

<h3>Prerequisites</h3>
<ul>
<li>Code Editor (VS Code, Sublime, Bracket, etc.)</li>
<li>Node and npm installed on your machine.</li>
<li>MongoDB server. Click <a href="https://www.mongodb.com/docs/manual/administration/install-community/">here</a> to install MongoDB on your system.</li>
<li>Internet connection to download project dependencies</li>
</ul>

Let's get started on how to run this project.
<h4>Step 1</h4>
<ol>
<li>Clone this repository using the command line, or download the zip file and open the project folder in your code editor.</li>
<li>Navigate to the projects root folder from your system's command line, or VS code's terminal.</li>
<li>Run <b>npm install</b> to download all dependencies for this project.</li>
</ol>
<h4>Step 2</h4>
<ol>
<li>Download and install MongoDB on your system. You can either run <b>MongoDB</b> as a service or Manually.</li>
<li>Start the <b>MongoDB</b> server, but make sure you have created a folder to store your Database files.</li>
<li>Go back to your code editor (VS Code) and open the terminal, type <b>node server.js</b> and hit enter.</li>
<li>You should see a message with the text "Server started on port 3000" in your console / terminal.</li>
<li>Go to any web browser on your machine, type localhost:3000 and hit Enter.</li>
 <li>You should now see the home page of the system</li>
</ol>


<div>
  <h3><b>The Design</b></h3>
  After successfully launching the system in your browser, you'll see four (4) sections.
  <ul>
    <li>STOCKS</li>
    <li>SALES</li> 
    <li>SEARCH</li> 
    <li>SETTINGS</li>
  </ul>
  
  <ol>
    <li><h4><b>STOCKS</b></h4>
      <ul>
        <li>All products categories are listed in this section. (Eg: iPhones, iPads, Macbooks, Series, etc.)</li>
        <li>You'll be able to add products only from the <b>STOCKS</b> section.</li>
        <li>Products you add can be edited or sold from this section.</b></li>
        <li>When selling a product, you can split payment when a buyer wants to pay with both cash and any form of digital payment</li>
      </ul>
    </li>
    
   <li><h4><b>SALES</b></h4>
    <ul>
      <li>This section gives information on what have been sold, revenue earned, it basically gives account on the business.</li>
      <li>You can view accounts on specific dates from this section. There's a date field on top for this operation.</li>
      <li>Accessories (handsfree, phone covers, chargers, etc.) can be sold only from this section.</li>
      <li>You can split payment when selling an accessories as well. (<b>Momo (mobile money)</b> represents digital payment)</b>.</li>
    </ul>
  </li>
  
  <li><h4>SEARCH</h4>
    <ul>
      <li>This section let's you search for any data stored in the system's database.</li>
      <li>You can search for a device using its IMEI or Serial Number.</li>
      <li>You can search when a device was added or sold using the <b>Date</b> option.</li>
      <li>You can verify a buyer's details using the <b>Customer Details</b> option.</li>
    </ul>
  </li>
  </ol>
</div>
