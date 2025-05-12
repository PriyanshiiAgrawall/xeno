import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        accountType: '',
        isSubscribed: 'No'
    });

    // Fetch customers on component mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('/api/customers');
            const data = await response.json();
            setCustomers(data.customers);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCustomer),
            });

            if (response.ok) {
                const data = await response.json();
                setCustomers([data.customer, ...customers]); // Add new customer to the top of the list
                setIsAddCustomerOpen(false);
                setNewCustomer({
                    name: '',
                    email: '',
                    phone: '',
                    city: '',
                    accountType: '',
                    isSubscribed: 'No'
                });
            }
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Customers</h1>
                <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Customer</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Customer</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddCustomer} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newCustomer.email}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={newCustomer.city}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="accountType">Account Type</Label>
                                <Select
                                    value={newCustomer.accountType}
                                    onValueChange={(value) => setNewCustomer({ ...newCustomer, accountType: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="regular">Regular</SelectItem>
                                        <SelectItem value="premium">Premium</SelectItem>
                                        <SelectItem value="vip">VIP</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="isSubscribed">Subscription Status</Label>
                                <Select
                                    value={newCustomer.isSubscribed}
                                    onValueChange={(value) => setNewCustomer({ ...newCustomer, isSubscribed: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select subscription status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Yes">Yes</SelectItem>
                                        <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit">Add Customer</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map((customer) => (
                    <CustomerCard key={customer._id} customer={customer} />
                ))}
            </div>
        </div>
    );
};

export default CustomerList; 