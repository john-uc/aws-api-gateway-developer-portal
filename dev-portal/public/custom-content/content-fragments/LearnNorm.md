## Underlying Problems with Court Records

Courts can have different standards of representing an entity name (attorney, law firm, judge, party), causing the same entity in different courts to appear with multiple variations. These  variations can be due to

* **Misspellings:**  A person entering the information in the court’s Case Management System can misspell the name.

* **Different ways of representing the same name**: 

    * Some courts might represent a name as "**MICHAEL SCOTT HUNT**" others might call it **“MICHAEL S HUNT”** or **“HUNT, MICHAEL S”**

* **Name Changes:** This happens when the entity willingly changes its name. 

Cases involving a particular party, attorney, or judge may be missing from an analytics report if the data is pulled from sources where an entity name is misspelled, lacks a proper suffix, or the syntax is wrong. This is where **normalization** plays a key role. 

## **What is Entity **normalization**?** 

Entity normalization is a data processing procedure that identifies mentions of entities, disambiguates them, and organizes that data according to the underlying entities.

With a given set of court records, entity normalization tries to identify the exact Law Firm, Party, Attorney or Judge the data is trying to describe. 

**Why is Entity normalization important in Court Records ?** 

User Case: To identify all cases where an attorney **Philip Paul De Luca** has represented a party.

Solution without Normalization:

1. Query Unicourt  Search API with search terms "PHILIP PAUL DELUCA" and attribute “Attorney”

2. Process the results to select the attorneys that you think are the ones you are looking for

3. For a subset of the attorneys returned from the Search API, query for cases 

Problems with this approach

    1. False positives and False negatives caused due to misspellings or name changes.
This name can appear throughout official court records in myriad forms, accounting for various representations of the entity’s title, different spellings and misspellings of his name, the inclusion of middle initials, and more.

Solution with Normalization:

1. Search for "PHILIP PAUL DELUCA" Using Norm Search API.

2. Select the right entity and get its Norm ID( that is used to permanently represent the entity).

3. Query Norm Cases API with Norm ID to get a more accurate list of cases for PHILIP PAUL DELUCA.

Normalization will try to locate all variations of the entity from different sources that are aggregated (such as data from different court systems, state bar organizations, Secretary of State information and legal documents) and clusters them into a Unique ID that permanently represents this entity. 

This reduces the number of false positives and false negatives. The end user does not have to concern themselves with name changes, misspelled names, or syntactical differences used in court records.

## How does Normalization work?

**The scope of normalization is a state-wide jurisdiction for each State in the US and Federal Jurisdiction for all Federal Courts. **This jurisdiction is referred to as norm_jurisdiction in Norm APIs.

We further enrich normalization by linking normalized entities with publicly available government and other authoritative records (which we refer to as Real World Data - RWD) such as Attorney BAR Data or Secretary of State Data. 

Normalized entities which have an association with Real World Data can provide access to information like phone numbers, email addresses, bar numbers (for attorneys), sos numbers (for businesses), office addresses, .etc . 

**However not all normalized entities will be associated to RWD.** This relationship is made evident with the field ‘is_real_world_entity’ in the Norm API responses. Not all normalized entities have real world data associated with them, but a majority of them do.

**We also try to link entities across norm_jurisdictions for Businesses such as Law Firms or Parties. We do not do this for individual entities like Attorneys and Judges. **This is because an attorney "JOHN SMITH" barred in California and the attorney “JOHN SMITH” barred in Florida might not be the same person. 

Organization names on the other hand are usually trademarked. **It’s a safe bet to assume that two organizations in different norm_jurisdictions are the same entity if their names are highly similar.** For example, DLA PIPER US LLP in Florida is the same entity as DLA PIPER US (LLP) in California.

**Once we find the same entity in multiple norm_jurisdictions we give them the same unique ID. **Now all the data associated with "DLA PIPER" is tagged with the same unique ID which can be used to gather data about the entity in different norm_jurisdictions.. 

**If you searched for the attorney "JOHN SMITH" you would get multiple entities with different norm_jurisdictions**. 

"results": [

    {

      "available_norm_jurisdictions": [

        "virginia-state-courts"

      ],

      "available_state_bars": [],

      "first_name": "AARON",

      "full_name": "AARON JOHN SMITH",

      "is_real_world_entity": true,

      "last_name": "SMITH",

      "middle_name": "JOHN",

      "norm_attorney_id": "KG9VVMqa7S2Jt",

      "version": "aa"

    },

    {

      "available_norm_jurisdictions": [

        "florida-state-courts"

      ],

      "available_state_bars": [

        {

          "bar_number": "429899",

          "state_code": "FL"

        }

      ],

      "first_name": "ANDREW",

      "full_name": "ANDREW JOHN SMITH",

      "is_real_world_entity": true,

      "last_name": "SMITH",

      "middle_name": "JOHN",

      "norm_attorney_id": "nnS3Gbvf68eb7",

      "version": "aa"

    }

]

**But if you searched for LAW FIRM "DLA PIPER", you would get 1 entity with multiple norm_jurisdictions:
**

"results": [

    {

      "available_norm_jurisdictions": [

        "california-state-courts",

        "florida-state-courts",

        "federal-courts"

      ],

      "available_sos": [

        {

          "sos_number": "202001197001",

          "state_code": "CA"

        },

        {

          "sos_number": "LLP020001020",

          "state_code": "FL"

        }

      ],

      "is_real_world_entity": true,

      "name": "DLA PIPER LLP (US)",

      "norm_law_firm_id": "2cjku5hXFQHvB",

      "version": "aa"

    }

]

## Which Norm Jurisdictions are supported?

Different Norm Jurisdictions have different ways of representing the same data. This is a challenge we overcome step by step with normalization. Normalization is still work in progress for most norm_jurisdictions. 

**Presently we have successfully been able to normalize entities in**** Florida State Courts, California State Courts, and Federal Courts.
**

|Norm Jurisdiction|Value in API|Support|
|--- |--- |--- |
|California|california-state-courts|Yes|
|Florida|florida-state-courts|Yes|
|Federal|federal-courts|Yes|
|New York|new-york-state-courts|Coming Soon|
|Texas|texas-state-courts|Coming Soon|
|Alabama|alabama-state-courts||
|Alaska|alaska-state-courts||
|Arizona|arizona-state-courts||
|Arkansas|arkansas-state-courts||
|Colorado|colorado-state-courts||
|Connecticut|connecticut-state-courts||
|Delaware|delaware-state-courts||
|Georgia|georgia-state-courts||
|Hawaii|hawaii-state-courts||
|Idaho|idaho-state-courts||
|Illinois|illinois-state-courts||
|Indiana|indiana-state-courts||
|Iowa|iowa-state-courts||
|Kansas|kansas-state-courts||
|Kentucky|kentucky-state-courts||
|Louisiana|louisiana-state-courts||
|Maine|maine-state-courts||
|Maryland|maryland-state-courts||
|Massachusetts|massachusetts-state-courts||
|Michigan|michigan-state-courts||
|Minnesota|minnesota-state-courts||
|Mississippi|mississippi-state-courts||
|Missouri|missouri-state-courts||
|Montana|montana-state-courts||
|Nebraska|nebraska-state-courts||
|Nevada|nevada-state-courts||
|New Hampshire|new-hampshire-state-courts||
|New Jersey|new-jersey-state-courts||
|New Mexico|new-mexico-state-courts||
|North Carolina|north-carolina-state-courts||
|North Dakota|north-dakota-state-courts||
|Ohio|ohio-state-courts||
|Oklahoma|oklahoma-state-courts||
|Oregon|oregon-state-courts||
|Pennsylvania|pennsylvania-state-courts||
|Rhode Island|rhode-island-state-courts||
|South Carolina|south-carolina-state-courts||
|South Dakota|south-dakota-state-courts||
|Tennessee|tennessee-state-courts||
|Utah|utah-state-courts||
|Vermont|vermont-state-courts||
|Virginia|virginia-state-courts||
|Washington|washington-state-courts||
|Washington D.C.|washington-dc-state-courts||
|West Virginia|west-virginia-state-courts||
|Wisconsin|wisconsin-state-courts||
|Wyoming|wyoming-state-courts||

## What Entities are Normalized?

**Attorneys, Judges, Law Firms** are normalized by Unicourt. Additionally, **Parties which are businesses or organizations **are normalized. But Parties that are individuals are not normalized.

## Why is norm_jurisdiction a required field when getting associated entities?

Individuals like Attorneys and Judges cannot be identified across norm_jurisdictions. 

**If you wanted to retrieve all associated Attorneys of a given Law Firm, you would have to provide the norm_jurisdiction**. This helps us narrow down the exact results you are looking for. 

## If I query for all the cases of an attorney, I find law firm attorney associations that do not exist in the court records. Why? 

This is because when the court records do not give us the attorney firm relationships, we try to infer them base on  whether the attorney has appeared with the firm in another jurisdiction or in another case during the same period. 

