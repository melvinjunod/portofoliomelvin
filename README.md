<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/melvinjunod/tf2killstreaktradingdatabase">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">TF2 Killstreak Trading Database</h3>

  <p align="center">
    Keep track of your group's income and expenses when trading killstreak kits!
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#moreinfo">More info about killstreak trading</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

In the video game "Team Fortress 2", you can buy and sell in-game items for real money. Two of these items are Killstreak Kit Fabricators and Killstreak Kits. 
Killstreak Kit Fabricators are recipes that require a number of other items to complete. When these Fabricators are completed, you can receive Killstreak Kits.
Sometimes, the price to buy said fabricators and the items(hereon refered to as "materials") are cheaper than the lowest price the killstreak kit produced by the fabricator is curently being sold for. This way, it is possible to make a profit by buying fabricators and materials and selling the killstreak kits they produce.
<br>
This database and script allows you to keep track of the fabricators and materials you've bought, the prices of materials, kits currently on sale and kits that have been sold. 
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MORE INFO ABOUT KILLSTREAK TRADING -->
## More info about killstreak trading
Each killstreak kit and fabricator are tied to a "weapon", "sheen" and "killstreaker". What they are exactly is not as important, but each of these have a market value of their own. Different kits for different weapons have different prices, some sheens are more desired than others, etc.
<br>
Killstreak kits and fabricators have three different tiers:
<ul>
<li>Basic</li>
<li>Specialized</li>
<li>Professional</li>
</ul>
Basic kits are required to create specialized kits, which in turn are required to create professional kits. This database only manages professional kits since it is by far the most profitable to trade. Basic and specialized kits go into the list of materials - everything required to create a professional kit, except for the professional fabricator itself.
<br>
Materials are split into different types, and each type has multiple different individual items which may have different prices. Each professional fabricator requires a set number of each material type to complete but which material specifically is chosen randomly. The following amount of materials of a type are required to complete a professional fabricator from scratch:
<ul>
<li><b>64</b> Battle-worn Robo Part</li>
<li><b>16</b> Reinforced Robo Part</li>
<li><b>3</b> Pristine Robo Part</li>
<li><b>4</b> Unique Weapons*</li>
<li><b>2</b> Specialized Killstreak Kit Fabricators</li>
<li><b>2</b> Basic Killstreak Kits</li>
</ul>
*The unique weapons must match the ones demanded by the basic and specialized killstreak kits, and are further split into two types: regular unique weapons, and expensive unique weapons. Regular unique weapons all share the same static price, but expensive unique weapons each have different prices that may change over time. 


<p align="right">(<a href="#readme-top">back to top</a>)</p>

