const stripe = require("stripe")("sk_test_51O7vK8SCU10lo8i8ODJnautnIVsem8JZn3DMr938sj3WfMe6dZB4a4II6R7TU2f4lM1b5oHmtrQjexnFol31Bjp500hYdVamY2");
const uuid = require("uuid").v4; 

exports.handlePayment = (req,res) => {
    const { product, token, subTotal } = req.body;
  console.log("PRODUCT ", product);
  console.log("PRICE ", subTotal);
  
  const idempontencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id
    })
    .then(customer => {
      stripe.charges.create(
        {
          amount: subTotal,
          currency: "inr",
          customer: customer.id,
          receipt_email: token.email,
          description: `purchase of ${product}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country
            }
          }
        },
        { idempontencyKey }
      );
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err));

}