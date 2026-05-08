-- Add your SQL here
SELECT Employee.ID, Employee.NAME, Contact_Info.EMAIL, Contact_Info.PHONE_NUMBER, Stores.LOCATION, Stores.REVENUE
FROM Employee
INNER JOIN Contact_Info ON Employee.ID = Contact_Info.ID
INNER JOIN Stores ON Employee.LOCATION = Stores.LOCATION
WHERE Stores.LOCATION IN ('Portland', 'Seattle', 'Los Angeles', 'San Francisco')
ORDER BY Employee.ID;