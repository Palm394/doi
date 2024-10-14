CREATE TABLE assets (
    id uuid PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(255),
    current_value DECIMAL(10, 6),
    current_value_currency VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 8) NOT NULL,
    price_per_unit DECIMAL(10, 8) NOT NULL,
    total_value DECIMAL(10, 8) NOT NULL,
    fees DECIMAL(10, 8) NOT NULL,
    notes TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE account_asset (
    PRIMARY KEY (account_id, asset_id),
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 8) NOT NULL,
    average_cost DECIMAL(10, 8) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);