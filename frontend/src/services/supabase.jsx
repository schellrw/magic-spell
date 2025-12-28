import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth Operations
export const authService = {
  async signUp(email, password, username, role = 'learner') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
};

// Word List Operations
export const wordListService = {
  // Get all word lists (excluding soft-deleted ones)
  async getAll() {
    const { data, error } = await supabase
      .from('word_lists')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get active word list
  async getActive() {
    const { data, error } = await supabase
      .from('word_lists')
      .select('*')
      .is('deleted_at', null)
      .eq('is_active', true)
      .limit(1); // Limit to 1 for backward compatibility, but ideally this should be replaced
    
    if (error) throw error;
    return data[0] || null; // Return the first active list or null if none
  },

  // Get all active word lists
  async getActives() {
    const { data, error } = await supabase
      .from('word_lists')
      .select('*')
      .is('deleted_at', null)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create new word list
  async create(name, words) {
    const { data, error } = await supabase
      .from('word_lists')
      .insert([
        { 
          name, 
          words: words.map(w => ({ text: w, mastered: false })),
          is_active: false 
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update existing word list (resets mastery)
  async update(id, name, words) {
    const { data, error } = await supabase
      .from('word_lists')
      .update({ 
        name, 
        words: words.map(w => ({ text: w, mastered: false }))
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Toggle active status for a single word list
  async toggleActive(id, isActive) {
    const { data, error } = await supabase
      .from('word_lists')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Soft delete word list
  async delete(id) {
    const { error } = await supabase
      .from('word_lists')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Test Results Operations
export const testResultService = {
  // Save test result
  async create(wordListIds, score, total, details) {
    // First, insert the test result itself
    const { data: testResultData, error: testResultError } = await supabase
      .from('test_results')
      .insert([
        {
          score,
          total,
          details
        }
      ])
      .select('id')
      .single();

    if (testResultError) throw testResultError;

    const testResultId = testResultData.id;

    // Then, insert entries into the linking table for each wordListId
    const testWordListEntries = wordListIds.map(wordListId => ({
      test_result_id: testResultId,
      word_list_id: wordListId
    }));

    const { error: linkingError } = await supabase
      .from('test_word_lists')
      .insert(testWordListEntries);

    if (linkingError) throw linkingError;

    return testResultData; // Return the created test result data
  },

  // Get all results for a word list
  async getByWordList(wordListId) {
    const { data, error } = await supabase
      .from('test_results')
      .select(`
        id,
        created_at,
        score,
        total,
        details,
        test_word_lists(word_list_id)
      `)
      .filter('test_word_lists.word_list_id', 'eq', wordListId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Feedback Media Operations
export const feedbackService = {
  // Upload voice clip
  async uploadVoice(file, isPositive) {
    const fileName = `${isPositive ? 'positive' : 'negative'}-${Date.now()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage
      .from('voice-clips')
      .upload(fileName, file);
    
    if (error) throw error;
    return data;
  },

  // Upload image
  async uploadImage(file, isHappy) {
    const fileName = `${isHappy ? 'happy' : 'concerned'}-${Date.now()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage
      .from('feedback-images')
      .upload(fileName, file);
    
    if (error) throw error;
    return data;
  },

  // Get all voice clips
  async getVoiceClips() {
    const { data, error } = await supabase.storage
      .from('voice-clips')
      .list();
    
    if (error) throw error;
    return data;
  },

  // Get all feedback images
  async getImages() {
    const { data, error } = await supabase.storage
      .from('feedback-images')
      .list();
    
    if (error) throw error;
    return data;
  },

  // Get public URL for file
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
};

// App Settings Operations
export const settingsService = {
  // Get feedback images
  async getFeedbackImages() {
    const { data, error } = await supabase
      .from('app_settings')
      .select('key, value')
      .in('key', ['correct_image', 'incorrect_image']);

    if (error) {
        console.error("Error fetching settings:", error);
        return { correct_image: null, incorrect_image: null };
    }
    
    // Convert array to object
    return data.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
  },

  // Update a setting
  async updateSetting(key, value) {
    const { data, error } = await supabase
      .from('app_settings')
      .upsert({ key, value })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};