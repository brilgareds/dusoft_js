SELECT *
FROM (SELECT
    invoices.id_invoice,
    invoices.id_compani,
    invoices.id_customer,
    invoices.id_user,
    invoices.value_invoice,
    invoices.date_created,
    customer_name,
    customers.address,
    customers.phone,
    users.first_name,
    users.last_name,
    companies.name
FROM invoices, customers, companies, users
WHERE invoices.id_customer = 99 AND invoices.date_created >= '2018-02-16 00:00:00' AND
    invoices.date_created <= '2018-02-16 12:23:00' AND customers.id_customer = invoices.id_customer AND
    companies.id_company = invoices.id_compani AND invoices.id_user = users.id_user) AS RS2, (SELECT count(id_service)
FROM invoices_services, (SELECT
    invoices.id_invoice,
    invoices.id_compani,
    invoices.id_customer,
    invoices.id_user,
    invoices.value_invoice,
    invoices.date_created,
    customer_name,
    customers.address,
    customers.phone,
    users.first_name,
    users.last_name,
    companies.name
FROM invoices, customers, companies, users
WHERE invoices.id_customer = 99 AND invoices.date_created >= '2018-02-16 00:00:00' AND
    invoices.date_created <= '2018-02-16 12:23:00' AND customers.id_customer = invoices.id_customer AND
    companies.id_company = invoices.id_compani AND invoices.id_user = users.id_user) AS RS1
WHERE invoices_services.id_invoice = RS1.id_invoice
GROUP BY invoices_services.id_invoice) AS RS3