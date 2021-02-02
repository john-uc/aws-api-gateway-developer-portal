## Underlying Problems with Court Records

Courts often have different standards for representing the names of entities, such as attorneys, law firms, parties, and judges, which causes those entities to have multiple variations across different courts. The most common causes of variations are:

- **Misspellings**
	-  Court personnel entering names of entities into the court&#39;s Case Management System can misspell an entity&#39;s name.
- **Name Variants**
	- While some courts might represent a name as &quot; **MICHAEL SCOTT HUNT**&quot; others might call it **&quot;MICHAEL S HUNT&quot;** or **&quot;HUNT, MICHAEL S&quot;** causing several variations from court to court.
- **Name Changes**
	- When entities willingly change their name, such as law firms undergoing a merger or when named partners leave or join a firm, this causes variations.

Cases involving a particular attorney, law firm, party, or judge may be missing from an analytics report if the data is pulled from sources where an entity name is misspelled, lacks a proper suffix, or the syntax is wrong. This is where **normalization** plays a key role.

## What Is Entity Normalization?

Entity normalization is a data processing procedure that identifies mentions of entities, disambiguates them, and organizes that data according to the underlying entities.

With a given set of court records, entity normalization tries to identify the exact attorney, law firm, party, or judge the data is trying to describe.

**Why is Entity Normalization Important for Court Records?**

Use Case: To identify all cases where an attorney **Philip Paul DeLuca** has represented a party.

Solution without Normalization:

1. Query Unicourt Search API with search terms &quot;PHILIP PAUL DELUCA&quot; and attribute &quot;Attorney&quot;
2. Process the results and select the attorneys you think are the right PHILIP PAUL DELUCA you are looking for
3. Query for cases involving the subset of attorneys you think are the right PHILIP PAUL DELUCA

Problems with this approach:

1. False positives and false negatives can be caused due to misspellings or name changes.
2. This name can appear throughout official court records in myriad forms, accounting for various representations of the entity&#39;s title, different spellings and misspellings of the entity&#39;s name, the inclusion of middle initials, and more.

Solution with Normalization:

1. Search for &quot;PHILIP PAUL DELUCA&quot; using the Norm Search API.
2. Select the right entity and get its Norm ID, which is used to permanently represent the entity across APIs.
3. Query the Norm Cases API with the entity&#39;s Norm ID to get a more accurate list of cases for PHILIP PAUL DELUCA.

Normalization locates all of the variations of a particular entity from different sources that UniCourt aggregates, such as data from different court systems, state bar organizations, Secretary of State business records, and legal documents, and then clusters those variations into a Unique ID that permanently represents that particular entity.

This greatly reduces the number of false positives and false negatives, so you don&#39;t have to worry about keeping up with name changes, misspelled names, and syntactical differences in court records.

##

## How Does Entity Normalization Work?

**The scope of entity normalization is a state-wide jurisdiction for each state in the US, as well as a federal jurisdiction for all federal courts in the US.** These jurisdictions are referred to as norm\_jurisdiction in the Norm APIs.

We further enrich entity normalization by linking normalized entities with publicly available data from government records and other authoritative records, such as attorney bar data and Secretary of State data, which we refer to as Real World Data.

Normalized entities that have an association with Real World Data can provide access to additional information like phone numbers, email addresses, bar numbers for attorneys, Secretary of State numbers for businesses, office addresses, and more.

**However, not all normalized entities will be associated with Real World Data.** This relationship is made evident with the field &#39;is\_real\_world\_entity&#39; in the Norm API responses. While not all normalized entities have Real World Data associated with them, a majority of them do.

**We also try to link entities across norm\_jurisdictions for businesses such as law firms and parties. We do not do this for individual entities like attorneys and judges,** because the attorney &quot;JOHN SMITH&quot; barred in California and the attorney &quot;JOHN SMITH&quot; barred in Florida might not be the same person.

On the other hand, organization names are usually trademarked, and as such, **organizations in different norm\_jurisdictions are often the same entity if their names are highly similar.** For example, DLA PIPER US LLP in Florida is the same entity as DLA PIPER US (LLP) in California.

**Once we find the same entity across multiple norm\_jurisdictions, we give them the same unique Norm ID.** Now all the data associated with &quot;DLA PIPER&quot; is tagged with the same unique Norm ID, which can be used to gather data about the entity in different norm\_jurisdictions.

If you searched for the attorney &quot;JOHN SMITH&quot; you would get multiple entities with different norm\_jurisdictions.

```
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
```

But if you searched for LAW FIRM &quot;DLA PIPER&quot;, you would get 1 entity with multiple norm\_jurisdictions.

```
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

```
##

## Which Norm Jurisdictions Are Supported?

Different norm jurisdictions have different ways of representing the same data. This is a challenge we overcome step by step with normalization. Normalization is still a work in progress for most norm\_jurisdictions.

**Presently we have successfully been able to normalize entities in Federal Courts, Florida State Courts, and California State Courts.**

| **Norm Jurisdiction** | **Value in API** | **Support** |
| --- | --- | --- |
| **California** | **california-state-courts** | **Yes** |
| **Florida** | **florida-state-courts** | **Yes** |
| **Federal** | **federal-courts** | **Yes** |
| New York | new-york-state-courts | Coming Soon |
| Texas | texas-state-courts | Coming Soon |
| Alabama | alabama-state-courts |
| Alaska | alaska-state-courts |
| Arizona | arizona-state-courts |
| Arkansas | arkansas-state-courts |
| Colorado | colorado-state-courts |
| Connecticut | connecticut-state-courts |
| Delaware | delaware-state-courts |
| Georgia | georgia-state-courts |
| Hawaii | hawaii-state-courts |
| Idaho | idaho-state-courts |
| Illinois | illinois-state-courts |
| Indiana | indiana-state-courts |
| Iowa | iowa-state-courts |
| Kansas | kansas-state-courts |
| Kentucky | kentucky-state-courts |
| Louisiana | louisiana-state-courts |
| Maine | maine-state-courts |
| Maryland | maryland-state-courts |
| Massachusetts | massachusetts-state-courts |
| Michigan | michigan-state-courts |
| Minnesota | minnesota-state-courts |
| Mississippi | mississippi-state-courts |
| Missouri | missouri-state-courts |
| Montana | montana-state-courts |
| Nebraska | nebraska-state-courts |
| Nevada | nevada-state-courts |
| New Hampshire | new-hampshire-state-courts |
| New Jersey | new-jersey-state-courts |
| New Mexico | new-mexico-state-courts |
| North Carolina | north-carolina-state-courts |
| North Dakota | north-dakota-state-courts |
| Ohio | ohio-state-courts |
| Oklahoma | oklahoma-state-courts |
| Oregon | oregon-state-courts |
| Pennsylvania | pennsylvania-state-courts |
| Rhode Island | rhode-island-state-courts |
| South Carolina | south-carolina-state-courts |
| South Dakota | south-dakota-state-courts |
| Tennessee | tennessee-state-courts |
| Utah | utah-state-courts |
| Vermont | vermont-state-courts |
| Virginia | virginia-state-courts |
| Washington | washington-state-courts |
| Washington D.C. | washington-dc-state-courts |
| West Virginia | west-virginia-state-courts |
| Wisconsin | wisconsin-state-courts |
| Wyoming | wyoming-state-courts |

##

## What Entities Are Normalized?

UniCourt normalizes attorneys, law firms, judges, and parties (except for individuals).

##

## Why Is Norm\_Jurisdiction a Required Field When Getting Associated Entities?

Individuals like attorneys and judges cannot be identified across norm\_jurisdictions.

If you want to retrieve all associated attorneys of a given law firm, you would need to provide the norm\_jurisdiction. This helps narrow down the exact results you are looking for.

##

## If I Query for All the Cases of an Attorney, I Find Law Firm / Attorney Associations That Do Not Exist in the Court Records. Why?

When court records do not provide the attorney / law firm relationships, we try to infer them based on whether the attorney has appeared with the firm in another jurisdiction or in another case during the same time period.