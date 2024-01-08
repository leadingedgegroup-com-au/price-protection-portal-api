-- --------------------------------------------------------
-- Price Protection Database 
-- @Author: Rajendra Kumar Majhi
-- @Created Date: 01-01-2023 Onwards
-- --------------------------------------------------------

/* 
-- --------------------------------------------------------
-- Table definition for `tbl_Groups`
-- --------------------------------------------------------
*/
CREATE TABLE tbl_Groups (
    ID INT PRIMARY KEY IDENTITY(1,1),
    [Group] NVARCHAR(255) NOT NULL,
    SortCode NVARCHAR(255) DEFAULT '',
    [Description] NVARCHAR(255) DEFAULT '',
    IsActive BIT NOT NULL DEFAULT 1,
    IsDelete BIT NOT NULL DEFAULT 0,
    CreatedBy INT,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedBy INT,
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

/*
-- --------------------------------------------------------
-- Table definition for `tbl_Suppliers`
-- --------------------------------------------------------
*/
CREATE TABLE tbl_Suppliers (
    ID INT PRIMARY KEY IDENTITY(1,1),
    SupplierCode NVARCHAR(MAX) NOT NULL DEFAULT '',
    SupplierName NVARCHAR(MAX) NOT NULL DEFAULT '',
    GroupID INT,
    Email NVARCHAR(MAX) NOT NULL DEFAULT '',
    Suburb NVARCHAR(MAX) NOT NULL DEFAULT '',
    [State] NVARCHAR(MAX) NOT NULL DEFAULT '',
    PostCode NVARCHAR(MAX) NOT NULL DEFAULT '',
    IsActive BIT NOT NULL DEFAULT 1,
    IsDelete BIT NOT NULL DEFAULT 0,
    CreatedBy INT,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedBy INT,
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Suppliers_Groups FOREIGN KEY (GroupID) REFERENCES tbl_Groups(ID)
);

-- --------------------------------------------------------
-- End of db.schema.sql File
-- --------------------------------------------------------
