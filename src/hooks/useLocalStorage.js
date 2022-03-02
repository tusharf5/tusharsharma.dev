import { useState } from "react";

// Hook
export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item =
        typeof window !== "undefined" && window.localStorage.getItem(key);

      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // const checkStorage = useCallback(() => {
  //   try {
  //     // Get from local storage by key
  //     const item =
  //       typeof window !== "undefined" && window.localStorage.getItem(key);
  //     // Parse stored json or if none return initialValue
  //     const val = item ? JSON.parse(item) : initialValue;
  //     setStoredValue(val);
  //   } catch {
  //     const val = initialValue;
  //     setStoredValue(val);
  //   }
  // }, [key, initialValue, setStoredValue]);

  // useEffect(() => {
  //   window.addEventListener("storage", checkStorage);
  //   return () => window.removeEventListener("storage", checkStorage);
  // }, [checkStorage]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      typeof window !== "undefined" &&
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
