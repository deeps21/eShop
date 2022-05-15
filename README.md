# eShop
<h1> Online Electric Store </h1>
The website displays electronic products. Users can add and remove products to/from their cart while also specifying the quantity of each item. They can then enter their address and choose Stripe to handle the payment processing.

## Tech Stack

**Client:** Angular, NGRX

**Server:** Node, Express

**Database**: MongoDB

<h2>USE CASES</h2>

<h3>ONE TO ONE:</h3>
<ul>
<li>Login page</li>
<li>editing profile page</li>
<li>one user to one cart/ one purchase history<l/i>
</ul>

<h3>one to many:</h3>
<ul>
<li>one user can order mutliple products.</li>
<li>one user can add multiple products to one cart(favourite list).</li>
<li>an admin can create/ edit / add or delete product which will be accessed by multiple users.</li>
</ul>

<h3>many to many:</h3>
<ul>
<li>multiple users can give review/comments on many product.</li>
</ul>


