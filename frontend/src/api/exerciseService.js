import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

export const getAllExercises = async (bodyPart) => {
  try {
    const res = await API.get(`/exercises/${bodyPart}`);

    if (!res.data || res.data.length === 0) {
      console.warn("No exercises found for:", bodyPart);
      return [];
    }

    console.log("✅ First exercise:", JSON.stringify(res.data[0], null, 2));
    console.log("🎬 gifUrl:", res.data[0]?.gifUrl);
    return res.data;
  } catch (error) {
    console.error("API ERROR:", error);
    return [];
  }
};