// Mock Stripe service - simulates Stripe API calls

const createCustomer = async (email, tenantName) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Return mock Stripe customer
  return {
    id: `cus_mock_${Date.now()}`,
    email,
    name: tenantName,
    created: Math.floor(Date.now() / 1000)
  };
};

const createInvoice = async (customerId, amount, description) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Return mock Stripe invoice
  return {
    id: `inv_mock_${Date.now()}`,
    customer: customerId,
    amount_due: Math.round(amount * 100), // Stripe uses cents
    currency: 'usd',
    description,
    status: 'open',
    created: Math.floor(Date.now() / 1000),
    hosted_invoice_url: `https://invoice.stripe.com/mock/${Date.now()}`
  };
};

const retrieveInvoice = async (invoiceId) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Return mock invoice details
  return {
    id: invoiceId,
    status: 'paid',
    amount_paid: 2500, // $25.00 in cents
    currency: 'usd'
  };
};

module.exports = {
  createCustomer,
  createInvoice,
  retrieveInvoice
};