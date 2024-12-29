import SymSpell from "node-symspell-new";

class SymSpellService {
  constructor(maxEditDistance = 2, prefixLength = 7) {
    this.symSpell = new SymSpell(maxEditDistance, prefixLength);
    this.isLoaded = false; // Track if the dictionary has been loaded
  }

  async loadDictionary(filePath) {
    try {
      // Use electronAPI to read the file content
      const dictionaryContent = await window.electronAPI.readFile(filePath);

      if (!dictionaryContent) {
        throw new Error("Failed to load dictionary content.");
      }

      if (!this.symSpell) {
        throw new Error("SymSpell instance not available.");
      }

      // Load the dictionary content into SymSpell
      await this.symSpell.loadDictionaryReact(dictionaryContent, 0, 1); // Assuming this is correct API
      this.isLoaded = true;
      console.log("SymSpellService Dictionary loaded successfully.");
    } catch (error) {
      console.error("Error loading dictionary:", error);
      this.isLoaded = false;
    }
  }


  // Method to get suggestions for a word
  getSuggestions(word) {
    if (!this.isLoaded) {
      throw new Error("Dictionary not loaded. Call loadDictionary() first.");
    }

    // Get suggestions with maxEditDistance of 2
    const suggestions = this.symSpell.lookup(word, 2);

    // Return the top 5 suggestions
    return suggestions.slice(0, 5).map(suggestion => ({
      term: suggestion.term,
      distance: suggestion.distance,
      count: suggestion.count,
    }));
  }




  async loadSymSpell(symSpellService, filePath) {
    try {
      await symSpellService.loadDictionary(filePath);
      return symSpellService;
    } catch (error) {
      console.error("Error loading dictionary:", error);
      throw error; // Re-throwing error for better error handling
    }
  }


}

export default SymSpellService;
