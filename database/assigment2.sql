INSERT INTO public.account(
    account_firstname,
    account_lastname,
    account_email,
    account_password
)
VALUES(
    'Tony',
    'Stark',
    'tony@startkent.com',
    'Iam1roM@n'
);

UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;


DELETE FROM public.account WHERE account_id = 1;

UPDATE public.inventory
SELECT inv_id = 10, REPLACE (inv_description,'small interiors', 'a huge interior') FROM inventory;


SELECT inventory.inv_make,inventory.inv_model, classification.classification_name
	FROM public.inventory 
	INNER JOIN public.classification
	ON public.inventory.inv_model = public.classification.classification_name;

UPDATE public.inventory
SET inv_image =  REPLACE(inv_image,'/images', '/images/vehicles');