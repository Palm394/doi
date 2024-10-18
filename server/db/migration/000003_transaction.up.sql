CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(255),
    current_value DECIMAL(16, 8),
    current_value_currency VARCHAR(5),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    type VARCHAR(255) NOT NULL,
    quantity DECIMAL(16, 8) NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(16, 8) NOT NULL,
    fees DECIMAL(4, 2) NOT NULL,
    notes TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE account_asset (
    PRIMARY KEY (account_id, asset_id),
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    quantity DECIMAL(16, 8) NOT NULL,
    average_cost DECIMAL(16, 8) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);