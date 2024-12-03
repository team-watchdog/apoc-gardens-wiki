# Apoc Gardens Wiki Contribution Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Cloning the Repository](#cloning-the-repository)
5. [Adding a New Crop](#adding-a-new-crop)
6. [Submission Process](#submission-process)
7. [Quality Guidelines](#quality-guidelines)

## <a id="project-overview"></a>Project Overview
This project aims to create a comprehensive database of crop and plant documentation for Sri Lankan climatic conditions, providing detailed information about various agricultural and horticultural species.

## <a id="prerequisites"></a>Prerequisites
Before contributing, ensure you have:
- A GitHub account
- Git installed on your local machine
- Basic understanding of markdown formatting
- Reliable sources for crop information

## <a id="getting-started"></a>Getting Started

### <a id="cloning-the-repository"></a>Cloning the Repository
There are multiple ways to clone the repository:

#### Method 1: Using HTTPS (Recommended for beginners)
```bash
# Open your terminal or command prompt
# Navigate to the directory where you want to clone the repository
cd path/to/your/projects/directory

# Clone the repository
git clone https://github.com/team-watchdog/apoc-gardens-wiki.git

# Navigate into the project directory
cd crop-documentation-project
```

#### Method 2: Using SSH (Recommended for advanced users)
```bash
# Ensure you have SSH keys set up with GitHub
# Clone the repository
git clone git@github.com:team-watchdog/apoc-gardens-wiki.git

# Navigate into the project directory
cd apoc-gardens-wiki
```

## <a id="adding-a-new-crop"></a>Adding a New Crop
All the crop information is mentioned in markdown (.md) format. The existing crops are located in `public/markdown` folder. First, navigate to this folder by;
```shell
cd public/markdown
```

### Folder Structure Guidelines
1. **Category Folders**: 
   - Use Capital Case with Spaces
   - Examples: 
     - `Vegetables`
     - `Fruits`
     - `Herbs & Spices`
     - `Roots`

2. **File Naming Convention**:
   - Use lowercase
   - Separate words with hyphens
   - `.md` extension
   - Examples:
     - `tomato.md`
     - `red-onion.md`
     - `star-fruit.md`

### Step-by-Step Process
1. **Create/Choose Category Folder**
   ```bash
   # If the category doesn't exist
   mkdir "Crop Category"
   
   # Navigate to the folder
   cd "Crop Category"
   ```

2. **Create Markdown File**
   ```bash
   # Create a new markdown file following naming conventions
   touch crop-name.md
   ```

3. **File Template**
   Use the following template exactly when creating your markdown file:

   ```markdown
   # [Crop Name]
   ![Plant/Flower Image](path/to/image.jpg "Image attribution")

   ## General Information
   **Generic name:** 
   **Local names:** 
   **Scientific name:** 
   **Plant family:** 
   **Edible parts:** 
   **Nutrition value:** 

   **Companion plants:**
   - 
   - 
   - 

   **Non-companion plants**
   - 
   - 

   ## Description:
   [Detailed description of the plant, including varieties, characteristics, and general appearance]

   ## Planting requirements
   **Planting season:** 

   ### Planting conditions:
   | Propagation | |
   |----|----|
   | Planting method | |
   | Soil | |
   | Water | |
   | Light | |
   | Fertiliser | |

   ### Growing conditions:
   | Temperatures | |
   |----|----|
   | Soil | |
   | Water | |
   | Pruning | |
   | Weed control | |

   ## Harvesting:
   [Instructions for harvesting]

   ## Curing:
   [Curing process, if applicable]

   ## Storage
   [Storage instructions]

   ## Protecting your plants
   ### Pest control
   **Pest type:**
   - 
   - 

   **Symptoms:**
   - **[Pest Name]:** 
   - 

   **Control method:**
   - **[Pest Name]:** 

   ### Disease Control
   **Disease type:**
   - 
   - 

   **Symptoms:**
   - **[Disease Name]:** 
   - 

   **Management:**
   - **[Disease Name]:** 

   ## Difficulty Rating
   ### [Region/Climate Zone] (Difficulty: X/10)
   **Explanation:** 
   **Challenges/Adaptations:**
   - 
   - 

   ## References for this entry
   ### Sources:
   - 
   - 
   
   ```

## <a id="submission-process"></a>Submission Process

### Creating a Pull Request
1. **Create a New Branch**
   ```bash
   # Create and switch to a new branch
   git checkout -b add-[crop-name]
   ```

2. **Stage Your Changes**
   ```bash
   # Add your new files
   git add .

   # Commit with a clear message
   git commit -m "Add documentation for [Crop Name] in [Category]"
   ```

3. **Push to Your Fork**
   ```bash
   git push origin add-[crop-name]
   ```

4. **Create Pull Request**
   - Go to the GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Provide a detailed description of your contribution

## <a id="quality-guidelines"></a>Quality Guidelines
- Use reputable, verifiable sources
- Provide scientific names
- Include comprehensive information
- Cite sources accurately
- Ensure information is current and accurate
- Use clear, concise language

## Tips for Successful Contribution
- Research thoroughly before submitting
- Use academic and agricultural research sources
- Include images with proper attribution
- Be precise in botanical and agricultural descriptions
- Consider multiple climate zones

## Contact
For questions or clarifications, please [open an issue](https://github.com/team-watchdog/apoc-gardens-wiki/issues) in the repository. 
