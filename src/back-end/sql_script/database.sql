CREATE TABLE Supplier
(
	supplier_id UUID DEFAULT uuid_generate_v1(),
	supplier_name VARCHAR(20) NOT NULL,
	email VARCHAR(20) NOT NULL,
	address VARCHAR(20) NOT NULL,
	phone VARCHAR(15) NOT NULL,
	constraint pkey_supplier PRIMARY KEY(supplier_id),
	constraint unique_val UNIQUE(supplier_name, email, address, phone)
);

CREATE TABLE Supply_line
(
	supplier_id UUID,
	product_id UUID,
	lot_id UUID,
	expiring_date DATE,
	price NUMERIC(5,2) DEFAULT 0.0,
	quantity INT NOT NULL,
	constraint supply_line_pkey PRIMARY KEY(supplier_id, product_id, lot_id, expiring_date)
);

CREATE TABLE Product
(
	product_id UUID DEFAULT uuid_generate_v1(),
	status VARCHAR(30) DEFAULT 'OUT OF STOCK',
	category VARCHAR(20) NOT NULL,
	product_name VARCHAR(20) NOT NULL,
	unit INT DEFAULT 0,
	constraint product_pkey PRIMARY KEY(product_id)
);
ALTER TABLE Product ADD COLUMN price NUMERIC(5,2) NOT NULL;

CREATE TABLE Branch
(
	branch_id UUID DEFAULT uuid_generate_v1(),
	address VARCHAR(20) NOT NULL,
	constraint branch_pkey PRIMARY KEY(branch_id),
	constraint branch_unique UNIQUE(address)
);

CREATE TABLE Branch_lot_line
(
	import_no SERIAL,
	branch_id UUID NOT NULL,
	lot_id UUID NOT NULL,
	product_id UUID NOT NULL,
	expiring_date DATE NOT NULL,
	quantity INT NOT NULL,
	constraint branch_lot_line_pkey PRIMARY KEY(import_no)
);

CREATE TABLE Lot
(
	lot_id UUID DEFAULT uuid_generate_v1(),
	import_date DATE NOT NULL,
	constraint lot_pkey PRIMARY KEY(lot_id)
);

CREATE TABLE Serve_line
(
	invoice_id INT NOT NULL,
	employee_id UUID NOT NULL,
	product_id UUID NOT NULL,
	cust_phone VARCHAR(15),
	quantity INT NOT NULL,
	--time DATE NOT NULL,
	constraint serve_line_pkey PRIMARY KEY(employee_id, product_id, invoice_id)
);

CREATE TABLE Employee
(
	employee_id UUID DEFAULT uuid_generate_v1(),
	role VARCHAR(20) NOT NULL,
	branch_id UUID NOT NULL,
	constraint employee_pkey PRIMARY KEY(employee_id)
);

CREATE TABLE Customer
(
	phone VARCHAR(15) PRIMARY KEY,
	fullname VARCHAR(20) NOT NULL,
	expenditure NUMERIC(5, 2) NOT NULL
);

CREATE TABLE Invoice
(
	invoice_id SERIAL PRIMARY KEY,
	export_date DATE
);
--Create foreign key

ALTER TABLE Supply_line ADD CONSTRAINT supplier_id_fkey FOREIGN KEY(supplier_id) REFERENCES
Supplier(supplier_id) ON DELETE CASCADE;

ALTER TABLE Supply_line ADD CONSTRAINT product_id_fkey FOREIGN KEY(product_id) REFERENCES
Product(product_id) ON DELETE CASCADE;

ALTER TABLE Branch_lot_line ADD CONSTRAINT branch_id_fkey FOREIGN KEY(branch_id) REFERENCES
Branch(branch_id) ON DELETE CASCADE;

ALTER TABLE Branch_lot_line ADD CONSTRAINT product_id_fkey FOREIGN KEY(product_id) REFERENCES
Product(product_id) ON DELETE CASCADE;

ALTER TABLE Serve_line ADD CONSTRAINT employee_id_fkey FOREIGN KEY(employee_id) REFERENCES
Employee(employee_id) ON DELETE CASCADE;

ALTER TABLE Serve_line ADD CONSTRAINT product_id_fkey FOREIGN KEY(product_id) REFERENCES
Product(product_id) ON DELETE CASCADE;

ALTER TABLE Serve_line ADD CONSTRAINT cust_phone_fkey FOREIGN KEY(cust_phone) REFERENCES
Customer(phone) ON DELETE CASCADE;

ALTER TABLE Supply_line ADD CONSTRAINT lot_id_fkey FOREIGN KEY(lot_id) REFERENCES
Lot(lot_id) ON DELETE CASCADE;

ALTER TABLE Serve_line ADD CONSTRAINT invoice_fkey FOREIGN KEY(invoice_id) REFERENCES
Invoice(invoice_id) ON DELETE CASCADE;

--Create triggers
--Trigger functions to automatically change unit record of product
CREATE OR REPLACE FUNCTION import_from_supply() RETURNS trigger AS $emp_stamp$
    BEGIN
        UPDATE Product SET unit = unit + NEW.quantity WHERE product_id = NEW.product_id;
        RETURN NULL;
    END;
$emp_stamp$ LANGUAGE plpgsql;

CREATE TRIGGER import_product AFTER INSERT ON Supply_line
    FOR EACH ROW EXECUTE FUNCTION import_from_supply();

--========================================================================================
--Trigger functions to automatically change unit record of product

--CREATE OR REPLACE FUNCTION export_to_branch() RETURNS trigger AS $emp_stamp$
--    DECLARE
--    remaining_unit   INT;
--    BEGIN
--	  SELECT unit FROM Product INTO remaining_unit WHERE product_id = NEW.product_id;
--	  IF (remaining_unit >= NEW.quantity) THEN
--        	UPDATE Product SET unit = remaining_unit - NEW.quantity WHERE product_id = NEW.product_id;
--		RETURN NEW;
--          ELSIF (remaining_unit < NEW.quantity) THEN
--	  	RETURN NULL;
--          END IF;
--    END;
--$emp_stamp$ LANGUAGE plpgsql;


--CREATE TRIGGER export_product_branch BEFORE INSERT ON Branch_lot_line
--	FOR EACH ROW EXECUTE FUNCTION export_to_branch();

--=========================================================================================
--Trigger functions to automatically change unit record of product
/*CREATE OR REPLACE FUNCTION export_to_customer() RETURNS trigger AS $emp_stamp$
    DECLARE
    remaining_unit   INT;
    BEGIN
	  SELECT unit FROM Product INTO remaining_unit WHERE product_id = NEW.product_id;
	  IF (remaining_unit >= NEW.quantity) THEN
        	UPDATE Product SET unit = remaining_unit - NEW.quantity WHERE product_id = NEW.product_id;
		RETURN NEW;
          ELSIF (remaining_unit < NEW.quantity) THEN
	  	RETURN NULL;
          END IF;
    END;
$emp_stamp$ LANGUAGE plpgsql;
*/

CREATE OR REPLACE FUNCTION export_to_customer() RETURNS trigger AS $emp_stamp$
    DECLARE
    remaining_unit INT;
    remaining_branch_unit INT;
    br_id UUID;
    BEGIN
          select distinct e.branch_id from employee e where e.employee_id = NEW.employee_id into br_id;
          select get_remaining_quantity(br_id, NEW.product_id) into remaining_branch_unit;
          SELECT unit FROM Product WHERE product_id = NEW.product_id  INTO remaining_unit;
	  IF (coalesce(remaining_branch_unit,0) >= NEW.quantity) THEN
        	UPDATE Product SET unit = remaining_unit - NEW.quantity WHERE product_id = NEW.product_id;
		RETURN NEW;
	  ELSE RETURN NULL;
          END IF;
    END;
$emp_stamp$ LANGUAGE plpgsql;

CREATE TRIGGER export_product_customer BEFORE INSERT ON Serve_line
	FOR EACH ROW EXECUTE FUNCTION export_to_customer();

--=========================================================================================
--trigger function to chech whether the record is exists in the Supply_line table before importing item to
--branch
CREATE OR REPLACE FUNCTION check_exist_supply() RETURNS trigger AS $emp_stamp$
	BEGIN
		IF(EXISTS(
	SELECT * FROM Supply_line s WHERE
	s.product_id = NEW.product_id AND s.lot_id = NEW.lot_id AND s.expiring_date = NEW.expiring_date
	)) THEN
		RETURN NEW;
		ELSE
		RETURN NULL;
		END IF;
	END;
$emp_stamp$ LANGUAGE plpgsql;


CREATE TRIGGER check_exists BEFORE INSERT ON Branch_lot_line
	FOR EACH ROW EXECUTE FUNCTION check_exist_supply();

	--========================================================================================
CREATE OR REPLACE FUNCTION calculate_import_price() RETURNS trigger AS $emp_stamp$
	    DECLARE
	    unit_price   FLOAT(2);
	    BEGIN
		  SELECT price FROM Product INTO unit_price WHERE product_id = NEW.product_id;
		  NEW.price = unit_price*NEW.quantity*0.8;
		  RETURN NEW;
	    END;
$emp_stamp$ LANGUAGE plpgsql;


CREATE TRIGGER calculate_price BEFORE INSERT ON Supply_line
	FOR EACH ROW EXECUTE FUNCTION calculate_import_price();

CREATE OR REPLACE FUNCTION check_expiring_date() RETURNS trigger AS $emp_stamp$
DECLARE
	import_date DATE;
BEGIN
		SELECT l.import_date FROM Lot l WHERE l.lot_id = NEW.lot_id INTO import_date;
		IF(import_date > NEW.expiring_date) THEN
			RETURN NULL;
		ELSE
			RETURN NEW;
		END IF;
END;
$emp_stamp$ LANGUAGE plpgsql;


CREATE TRIGGER check_expire BEFORE INSERT ON Supply_line
	FOR EACH ROW EXECUTE FUNCTION check_expiring_date();


--===========================================================================================
--query:
--import values to supply_line
--insert into Supply_line(supplier_id, product_id, lot_id, expiring_date, quantity)
--values()

/*
CREATE OR REPLACE FUNCTION update_status_branch() RETURNS trigger AS $emp_stamp$
DECLARE
	  remaining_unit INT;
BEGIN
		SELECT unit FROM Product WHERE product_id = NEW.product_id INTO remaining_unit;
		IF(remaining_unit = 0) THEN
                        UPDATE Product SET status = 'OUT OF STOCK' WHERE product_id = NEW.product_id;
                        RETURN NULL;
		ELSIF(remaining_unit <= 10) THEN
			UPDATE Product SET status = 'NEARLY OUT OF STOCK' WHERE product_id = NEW.product_id;
			RETURN NULL;
                ELSE
                        UPDATE Product SET status = 'NORMAL' WHERE product_id = NEW.product_id;
			RETURN NULL;
		END IF;
END;
$emp_stamp$ LANGUAGE plpgsql;


CREATE TRIGGER update_status AFTER INSERT ON Branch_lot_line
	FOR EACH ROW EXECUTE FUNCTION update_status_branch();

CREATE TRIGGER update_status AFTER INSERT ON Supply_line
	FOR EACH ROW EXECUTE FUNCTION update_status_branch();

CREATE TRIGGER update_status AFTER INSERT ON Serve_line
	FOR EACH ROW EXECUTE FUNCTION update_status_branch();
*/
--=============================================================================================
--trigger function to make sure that the quantity being exported to branches can not excess the quantity imported in the supply line
CREATE OR REPLACE FUNCTION check_quantity_branch() RETURNS trigger AS $emp_stamp$
DECLARE
	  current INT;
    total   INT;
BEGIN
		select s.quantity from supply_line s where s.product_id = NEW.product_id and s.lot_id = NEW.lot_id and s.expiring_date = NEW.expiring_date INTO total;
    select sum(b.quantity) from branch_lot_line b where NEW.product_id = b.product_id and NEW.lot_id = b.lot_id and NEW.expiring_date = b.expiring_date group by NEW.product_id, NEW.lot_id, NEW.expiring_date INTO current;

		IF(total < (current + NEW.quantity)) THEN
			RETURN NULL;
		ELSE
			RETURN NEW;
		END IF;
END;
$emp_stamp$ LANGUAGE plpgsql;


CREATE TRIGGER check_quantity BEFORE INSERT ON branch_lot_line
	FOR EACH ROW EXECUTE FUNCTION check_quantity_branch();

--==================================================================================================

	CREATE OR REPLACE FUNCTION check_quantity_export() RETURNS trigger AS $emp_stamp$
	BEGIN
			IF(NEW.quantity = 0) THEN
				RETURN NULL;
			ELSE
				RETURN NEW;
			END IF;
	END;
	$emp_stamp$ LANGUAGE plpgsql;


	CREATE TRIGGER check_quantity BEFORE INSERT ON serve_line
		FOR EACH ROW EXECUTE FUNCTION check_quantity_export();

		--===========================================================================================
alter table employee add constraint branch_id_fkey foreign key(branch_id) references branch(branch_id) on delete cascade;
alter table employee add column mail_addr varchar(50);


--old version of update product expiring date function
CREATE OR REPLACE FUNCTION update_product_exp_date() RETURNS VOID
language plpgsql
as
$$
declare
    id uuid;
    exp_dates record;
    exportquantity record;
    exp_date DATE;
    sum INT;
    index record;
begin
    for id in select product_id
           from product
    loop
        select expiring_date, quantity, ROW_NUMBER () OVER (ORDER BY expiring_date) from supply_line where product_id = id order by expiring_date into exp_dates;
        select product_id, sum(quantity) from serve_line where product_id = id group by product_id into exportquantity;

        --sum = select quantity from exp_dates where row_number = 1;
        sum = 0;
        for index in select expiring_date, quantity, ROW_NUMBER () OVER (ORDER BY expiring_date) from supply_line where product_id = id order by expiring_date
            loop
                exp_date = index.expiring_date;
                sum = sum + index.quantity;
                if(sum > exportquantity.sum) then
                      update product set expiring_date = exp_date where product_id = id;
											exit;
                end if;
            end loop;
    end loop;
end;
$$;

CREATE OR REPLACE FUNCTION get_remaining_quantity(br_id uuid, prod_id uuid) RETURNS INT
language plpgsql
as
$$
declare
    branch_quantity INT;
    sold_quantity INT;
begin
    select sum(quantity) from branch_lot_line where branch_id = br_id and product_id = prod_id group by branch_id, product_id into branch_quantity;
    select sum(quantity) from employee e join serve_line s on (s.employee_id = e.employee_id) where branch_id = br_id and product_id = prod_id group by branch_id, product_id into sold_quantity;
    return (coalesce(branch_quantity,0) - coalesce(sold_quantity, 0));
end;
$$;


/*
CREATE OR REPLACE FUNCTION get_product_expiring_date(br_id uuid, prod_id uuid) RETURNS DATE
language plpgsql
as
$$
declare
    item record;
    sold_quantity INT;
    exp_date DATE;
		current DATE;
    sum INT;
begin
    sum = 0;
		select CURRENT_DATE into current;
    select sum(quantity) from employee e join serve_line s on (s.employee_id = e.employee_id) where branch_id = br_id and product_id = prod_id group by branch_id, product_id into sold_quantity;
    for item in select expiring_date, sum(quantity) from branch_lot_line where branch_id = br_id and product_id = prod_id group by expiring_date order by expiring_date
    loop
        sum = sum + item.sum;
        exp_date = item.expiring_date;
        if(sum > coalesce(sold_quantity,0)) then return exp_date;
        elsif(sum = coalesce(sold_quantity,0)) then return current;
        end if;
    end loop;
    return current;
end;
$$;
*/

--function to get the expiring date of a product in a branch;
CREATE OR REPLACE FUNCTION get_product_expiring_date(br_id uuid, prod_id uuid) RETURNS DATE
language plpgsql
as
$$
declare
    item record;
    sold_quantity INT;
    exp_date DATE;
		current DATE;
    sum INT;
		remaining INT;
begin
    sum = 0;
		select CURRENT_DATE into current;
    select sum(quantity) from employee e join serve_line s on (s.employee_id = e.employee_id) where branch_id = br_id and product_id = prod_id group by branch_id, product_id into sold_quantity;
    select get_remaining_quantity(br_id, prod_id) into remaining;
    for item in select expiring_date, sum(quantity) from branch_lot_line where branch_id = br_id and product_id = prod_id group by expiring_date order by expiring_date
    loop
        sum = sum + item.sum;
        exp_date = item.expiring_date;
        if(sum > coalesce(sold_quantity,0)) then return exp_date;
        elsif(sum = coalesce(sold_quantity,0)) then
            if(remaining = 0) then return current;
            end if;
        end if;
    end loop;
    return current;
end;
$$;

--function to get the status of a product in a branch
CREATE OR REPLACE FUNCTION get_product_status(br_id uuid, prod_id uuid) RETURNS VARCHAR
language plpgsql
as
$$
declare
    remaining_unit INT;
    remaining_date INT;
    expiring_date DATE;
    status VARCHAR;
begin
    select get_remaining_quantity(br_id, prod_id) into remaining_unit;
    select get_product_expiring_date(br_id, prod_id) into expiring_date;
    select (expiring_date - CURRENT_DATE) into remaining_date;
    if(remaining_unit =0) then status = 'OUT OF STOCK';
    elsif(remaining_unit < 10) then status = 'NEARLY OUT OF STOCK';
    elsif(remaining_date <=0) then status = 'OUT DATED';
    elsif(remaining_date <10) then status = 'NEARLY OUT DATE';
    else status = 'NORMAL';
end if;
    return status;
end;
$$;

--Function to get the min expiring date of a product among branches
CREATE OR REPLACE FUNCTION get_product_expiring_date_admin(prod_id uuid) RETURNS DATE
language plpgsql
as
$$
declare
    branch UUID;
    exp_date DATE;
    temp_exp_date DATE;
		temp_exp_date_non_exists DATE;
		min_non_delivered DATE;
		delivered INT;
begin
    select max(expiring_date) from supply_line where product_id = prod_id group by product_id into exp_date;
		select min(expiring_date) from supply_line where product_id = prod_id group by product_id into temp_exp_date_non_exists;
		--select the min expiring date among non-delivered product
		select min(expiring_date) from (
				select expiring_date from supply_line where product_id = prod_id
				except
				select expiring_date from branch_lot_line where product_id = prod_id) as foo into min_non_delivered;

		select coalesce(count(*), 0) from branch_lot_line where product_id = prod_id into delivered;
		if(delivered = 0) then return temp_exp_date_non_exists;
		end if;
    for branch in select distinct br.branch_id from branch_lot_line br where br.product_id = prod_id
		--if all branches run out of stock --> OUT OF STOCK
		--if no branch is delivered --> min(expiring_date)
		--if yes branches are delivered all product--> min among those branches
		--yes branches are delivered and yet there are products are not delivered --> min (min outsise, min inside)
		-- if inside sold out --> min inside
		-- if inside not sold out --> min(out, in)

		--select s.product_id, sum(s.quantity) as "supplied", sum(br.quantity) as "exported", br.branch_id, s.lot_id, s.expiring_date
		--from supply_line s, branch_lot_line br
		--where s.product_id = br.product_id and s.lot_id = br.lot_id and s.expiring_date = br.expiring_date
		--group by s.product_id, s.lot_id, s.expiring_date, br.branch_id;
    loop
        select get_product_expiring_date(branch, prod_id) into temp_exp_date;
				if (temp_exp_date <= exp_date and temp_exp_date > CURRENT_DATE)
		   		then exp_date = temp_exp_date;
    		end if;
    end loop;

		--compare inside vs outside
		--check for existing non delivered product
		if(coalesce(min_non_delivered, CURRENT_DATE - 1) = (CURRENT_DATE - 1))
	  	then return exp_date;
		--if exist non delivered item
		elsif(min_non_delivered < exp_date) then exp_date = min_non_delivered;
		end if;
    return exp_date;
end;
$$;

--function to get the status of a product
CREATE OR REPLACE FUNCTION get_product_status_admin(prod_id uuid) RETURNS VARCHAR
language plpgsql
as
$$
declare
    branch UUID;
    remaining_date INT;
    exp_date DATE;
    remaining_unit INT;
begin
    select get_product_expiring_date_admin(prod_id) into exp_date;
    select unit from product where product_id = prod_id into remaining_unit;
    select (exp_date - CURRENT_DATE) into remaining_date;

    if(remaining_unit = 0) then return 'OUT OF STOCK';
    elsif(remaining_unit <10) then return 'NEARLY OUT OF STOCK';
    elsif(remaining_date <= 0) then return 'OUT DATED';
    elsif(remaining_date < 10) then return 'NEARLY OUT DATE';
    end if;
    return 'NORMAL';
end;
$$;

--function for admin to update product status
CREATE OR REPLACE FUNCTION update_product_status_admin() RETURNS VOID
language plpgsql
as
$$
declare
    id UUID;
begin
    for id in select product_id from product
    loop
        UPDATE Product SET expiring_date = get_product_expiring_date_admin(id) WHERE product_id = id;
        UPDATE Product SET status = get_product_status_admin(id) WHERE product_id = id;
    end loop;
end;
$$;


--function to calculate the income from invoices
CREATE OR REPLACE FUNCTION calculate_invoice(inv_id INT) RETURNS FLOAT
language plpgsql
as
$$
declare
    item record;
    sum float(2);
begin
    sum = 0;

    for item in select p.price, s.quantity from serve_line s, product p where s.product_id = p.product_id and s.invoice_id = inv_id
    loop
        sum = sum + item.quantity * item.price;
    end loop;
    return sum;
end;
$$;
