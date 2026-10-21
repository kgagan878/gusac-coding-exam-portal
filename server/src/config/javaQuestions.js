/**
 * CODE VERSE with Java - Official Question Bank
 * Total Points: 150
 * - Section A: 10 MCQs x 5 points = 50 points
 * - Section B: 2 Coding Problems x 50 points = 100 points
 */

const javaQuestions = [
  // SECTION A: 10 Java MCQs (5 Points Each = 50 Points)
  {
    order: 1,
    section: 'A',
    type: 'mcq',
    marks: 5,
    title: 'Type Casting & Integer Promotion in Byte Arithmetic',
    topic: 'Variables & Data Types',
    difficulty: 'Easy',
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        byte b = 50;
        b = (byte) (b * 2);
        byte c = (byte) (b * 2);
        System.out.println(b + " " + c);
    }
}`,
    options: [
      { key: 'A', text: '100 200' },
      { key: 'B', text: '100 -56' },
      { key: 'C', text: '100 0' },
      { key: 'D', text: 'Compilation Error' },
    ],
    correctOption: 'B',
    explanation: 'A byte in Java is an 8-bit signed integer with range -128 to 127. 50 * 2 = 100, which fits in a byte. 100 * 2 = 200, which exceeds 127 and overflows: 200 - 256 = -56.',
  },
  {
    order: 2,
    section: 'A',
    type: 'mcq',
    marks: 5,
    title: 'Unary Operators & Post/Pre-Increment Evaluation',
    topic: 'Operators & Expressions',
    difficulty: 'Medium',
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        int a = 5;
        int b = a++ + ++a * 2;
        System.out.println(a + " " + b);
    }
}`,
    options: [
      { key: 'A', text: '7 19' },
      { key: 'B', text: '7 17' },
      { key: 'C', text: '6 19' },
      { key: 'D', text: '6 17' },
    ],
    correctOption: 'A',
    explanation: 'a++ evaluates to 5 (a becomes 6). Then ++a increments a to 7 and evaluates to 7. 7 * 2 = 14. 5 + 14 = 19. Final value of a is 7, b is 19.',
  },
  {
    order: 3,
    section: 'A',
    type: 'mcq',
    marks: 5,
    title: 'String Immutability & String Pool Interning',
    topic: 'Strings & String Methods',
    difficulty: 'Medium',
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        String s1 = "GUSAC";
        String s2 = new String("GUSAC");
        String s3 = s2.intern();
        System.out.println((s1 == s2) + " " + (s1 == s3) + " " + s1.equals(s2));
    }
}`,
    options: [
      { key: 'A', text: 'true true true' },
      { key: 'B', text: 'false true true' },
      { key: 'C', text: 'false false true' },
      { key: 'D', text: 'true false true' },
    ],
    correctOption: 'B',
    explanation: 's1 refers to the string literal in the String Constant Pool. s2 is created in heap memory, so s1 == s2 is false. s2.intern() returns the pool reference, so s1 == s3 is true. equals() checks character content, which is true.',
  },
  {
    order: 4,
    section: 'A',
    type: 'mcq',
    marks: 5,
    title: 'Array References & Pass-by-Value Mechanics',
    topic: 'Arrays & References',
    difficulty: 'Medium',
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static void modify(int[] arr) {
        arr[0] = 99;
        arr = new int[]{1, 2, 3};
        arr[0] = 100;
    }
    public static void main(String[] args) {
        int[] data = {10, 20, 30};
        modify(data);
        System.out.println(data[0] + " " + data.length);
    }
}`,
    options: [
      { key: 'A', text: '99 3' },
      { key: 'B', text: '100 3' },
      { key: 'C', text: '10 3' },
      { key: 'D', text: '100 1' },
    ],
    correctOption: 'A',
    explanation: 'Java passes object references by value. arr[0] = 99 modifies the original array in the heap. Reassigning arr = new int[]{...} only alters the local method variable arr, not the caller reference data.',
  },
  {
    order: 5,
    section: 'A',
    type: 'mcq',
    marks: 5,
    title: 'Static Method Hiding vs Instance Method Overriding',
    topic: 'OOP & Inheritance',
    difficulty: 'Hard',
    description: 'What will be the output of the following Java program?',
    codeSnippet: `class Parent {
    static void show() { System.out.print("P_STAT "); }
    void display() { System.out.print("P_INST "); }
}
class Child extends Parent {
    static void show() { System.out.print("C_STAT "); }
    void display() { System.out.print("C_INST "); }
}
public class Main {
    public static void main(String[] args) {
        Parent obj = new Child();
        obj.show();
        obj.display();
    }
}`,
    options: [
      { key: 'A', text: 'C_STAT C_INST ' },
      { key: 'B', text: 'P_STAT C_INST ' },
      { key: 'C', text: 'P_STAT P_INST ' },
      { key: 'D', text: 'C_STAT P_INST ' },
    ],
    correctOption: 'B',
    explanation: 'Static methods are resolved at compile-time based on reference type (Parent), so obj.show() calls Parent.show(). Instance methods are resolved at runtime via dynamic dispatch, so obj.display() calls Child.display().',
  },
  {
    order: 6,
    section: 'A',
    type: 'mcq',
    marks: 5,
    title: 'Method Overloading vs Autoboxing & Varargs Priority',
    topic: 'Method Overloading',
    difficulty: 'Medium',
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    static void test(long n) { System.out.print("LONG "); }
    static void test(Integer n) { System.out.print("INTEGER "); }
    static void test(int... n) { System.out.print("VARARGS "); }

    public static void main(String[] args) {
        int val = 25;
        test(val);
    }
}`,
    options: [
      { key: 'A', text: 'LONG ' },
      { key: 'B', text: 'INTEGER ' },
      { key: 'C', text: 'VARARGS ' },
      { key: 'D', text: 'Compilation Error' },
    ],
    correctOption: 'A',
    explanation: 'Java method resolution priority is: 1) Exact match, 2) Widening primitive conversion (int to long), 3) Autoboxing (int to Integer), 4) Varargs. Widening beats autoboxing.',
  },
  {
    order: 7,
    section: 'A',
    type: 'mcq',
    marks: 5,
    title: 'Static & Instance Initializer Execution Order',
    topic: 'Static Variables & Blocks',
    difficulty: 'Hard',
    description: 'What will be the output of the following Java program?',
    codeSnippet: `class Base {
    static { System.out.print("1 "); }
    { System.out.print("2 "); }
    Base() { System.out.print("3 "); }
}
class Derived extends Base {
    static { System.out.print("4 "); }
    { System.out.print("5 "); }
    Derived() { System.out.print("6 "); }
}
public class Main {
    public static void main(String[] args) {
        new Derived();
    }
}`,
    options: [
      { key: 'A', text: '1 2 3 4 5 6 ' },
      { key: 'B', text: '1 4 2 3 5 6 ' },
      { key: 'C', text: '4 1 5 2 6 3 ' },
      { key: 'D', text: '1 4 3 2 6 5 ' },
    ],
    correctOption: 'B',
    explanation: 'Execution order: 1) Superclass static blocks (1), 2) Subclass static blocks (4), 3) Superclass instance initializers (2), 4) Superclass constructor (3), 5) Subclass instance initializers (5), 6) Subclass constructor (6). Output: 1 4 2 3 5 6.',
  },
  {
    order: 8,
    section: 'A',
    type: 'mcq',
    marks: 5,
    title: 'Exception Handling: Finally Return Value Masking',
    topic: 'Exception Handling',
    difficulty: 'Medium',
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static int compute() {
        try {
            int x = 10 / 0;
            return 10;
        } catch (ArithmeticException e) {
            return 20;
        } finally {
            return 30;
        }
    }
    public static void main(String[] args) {
        System.out.println(compute());
    }
}`,
    options: [
      { key: 'A', text: '20' },
      { key: 'B', text: '30' },
      { key: 'C', text: '10' },
      { key: 'D', text: 'ArithmeticException is thrown' },
    ],
    correctOption: 'B',
    explanation: 'The finally block always executes before the method returns. A return statement in finally suppresses and overrides any previous return value or unhandled exception, returning 30.',
  },
  {
    order: 9,
    section: 'A',
    type: 'mcq',
    marks: 5,
    title: 'Enhanced For Loop & ConcurrentModificationException',
    topic: 'Collections Basics',
    difficulty: 'Medium',
    description: 'What will be the output of the following Java program?',
    codeSnippet: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
        try {
            for (String s : list) {
                if (s.equals("B")) {
                    list.remove(s);
                }
            }
            System.out.println("Size: " + list.size());
        } catch (ConcurrentModificationException e) {
            System.out.println("CME Caught");
        }
    }
}`,
    options: [
      { key: 'A', text: 'Size: 2' },
      { key: 'B', text: 'CME Caught' },
      { key: 'C', text: 'Size: 3' },
      { key: 'D', text: 'Compilation Error' },
    ],
    correctOption: 'B',
    explanation: 'Modifying an ArrayList directly (list.remove()) while iterating via an enhanced for-loop invalidates the underlying iterator modCount, throwing ConcurrentModificationException.',
  },
  {
    order: 10,
    section: 'A',
    type: 'mcq',
    marks: 5,
    title: 'Autoboxing & Integer Cache Boundary Comparison',
    topic: 'Variables & Wrapper Classes',
    difficulty: 'Medium',
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        Integer a = 127;
        Integer b = 127;
        Integer c = 128;
        Integer d = 128;
        System.out.println((a == b) + " " + (c == d));
    }
}`,
    options: [
      { key: 'A', text: 'true true' },
      { key: 'B', text: 'false false' },
      { key: 'C', text: 'true false' },
      { key: 'D', text: 'false true' },
    ],
    correctOption: 'C',
    explanation: 'Java caches Integer instances between -128 and 127 in the IntegerCache. Thus a and b reference the same cached object (a == b is true). 128 is outside the cache, creating new objects (c == d is false).',
  },

  // SECTION B: 2 Java Coding Questions (50 Points Each = 100 Points)
  {
    order: 11,
    section: 'B',
    type: 'coding',
    marks: 50,
    title: 'Character Frequency Sorter',
    topic: 'Strings & HashMaps',
    difficulty: 'Medium',
    description: 'Write a Java program that reads a string from standard input, counts the frequency of each alphabetical character (case-insensitive), and prints each distinct character along with its count in alphabetical order formatted as "char:count" separated by spaces. Ignore non-alphabetic characters and spaces.',
    inputFormat: 'A single line containing the string S.',
    outputFormat: 'Space-separated lowercase character frequency pairs in alphabetical order, e.g., "a:3 b:1 n:2".',
    constraints: '1 <= S.length <= 10^5. Characters are ASCII.',
    starterCode: {
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNextLine()) return;
        String input = scanner.nextLine();
        
        int[] freq = new int[26];
        for (char ch : input.toLowerCase().toCharArray()) {
            if (ch >= 'a' && ch <= 'z') {
                freq[ch - 'a']++;
            }
        }
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 26; i++) {
            if (freq[i] > 0) {
                if (sb.length() > 0) sb.append(" ");
                sb.append((char)('a' + i)).append(":").append(freq[i]);
            }
        }
        
        System.out.println(sb.toString());
    }
}`
    },
    sampleTestCases: [
      {
        input: 'banana',
        expectedOutput: 'a:3 b:1 n:2',
        explanation: 'Characters in banana: a appears 3 times, b appears 1 time, n appears 2 times.',
      },
      {
        input: 'gusac',
        expectedOutput: 'a:1 c:1 g:1 s:1 u:1',
        explanation: 'Characters in gusac sorted alphabetically with count 1 each.',
      },
    ],
    hiddenTestCases: [
      {
        input: 'gitam university',
        expectedOutput: 'a:2 e:1 g:1 i:3 m:1 n:1 r:1 s:1 t:2 u:1 v:1 y:1',
        explanation: 'Case insensitive character count excluding space.',
      },
      {
        input: 'codeverse',
        expectedOutput: 'c:1 d:1 e:3 o:1 r:1 s:1 v:1',
        explanation: 'Alphabetical frequency for codeverse.',
      },
      {
        input: 'Java SE 17!',
        expectedOutput: 'a:2 e:1 j:1 s:1 v:1',
        explanation: 'Digits and punctuation are ignored.',
      },
    ],
  },
  {
    order: 12,
    section: 'B',
    type: 'coding',
    marks: 50,
    title: 'Pairs with Target Difference',
    topic: 'Arrays & Searching Algorithms',
    difficulty: 'Medium',
    description: 'Given an array of integers and a non-negative target difference K, find and print the total number of unique pairs (A, B) such that A - B = K, where A >= B.',
    inputFormat: 'First line: Integer N (size of array).\nSecond line: N space-separated integers.\nThird line: Integer K (target difference).',
    outputFormat: 'Print a single integer: the count of distinct pairs with difference K.',
    constraints: '1 <= N <= 10^5, -10^6 <= arr[i] <= 10^6, 0 <= K <= 10^6.',
    starterCode: {
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNextInt()) return;
        int n = scanner.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        int k = scanner.nextInt();
        
        Set<Integer> set = new HashSet<>();
        for (int num : arr) {
            set.add(num);
        }
        
        int count = 0;
        if (k == 0) {
            Map<Integer, Integer> freq = new HashMap<>();
            for (int num : arr) freq.put(num, freq.getOrDefault(num, 0) + 1);
            for (int c : freq.values()) {
                if (c > 1) count++;
            }
        } else {
            for (int num : set) {
                if (set.contains(num + k)) {
                    count++;
                }
            }
        }
        
        System.out.println(count);
    }
}`
    },
    sampleTestCases: [
      {
        input: '5\n1 5 3 4 2\n2',
        expectedOutput: '3',
        explanation: 'Pairs with difference 2: (3, 1), (4, 2), (5, 3). Count = 3.',
      },
      {
        input: '4\n8 12 16 4\n4',
        expectedOutput: '3',
        explanation: 'Pairs with difference 4: (8, 4), (12, 8), (16, 12). Count = 3.',
      },
    ],
    hiddenTestCases: [
      {
        input: '6\n1 3 5 8 6 4\n2',
        expectedOutput: '4',
        explanation: 'Pairs with difference 2: (3,1), (5,3), (6,4), (8,6).',
      },
      {
        input: '5\n1 2 3 2 1\n0',
        expectedOutput: '2',
        explanation: 'Duplicates with difference 0: 1 and 2 appear more than once.',
      },
      {
        input: '6\n10 20 30 40 50 60\n20',
        expectedOutput: '4',
        explanation: 'Pairs with difference 20: (30,10), (40,20), (50,30), (60,40).',
      },
    ],
  },
];

module.exports = { javaQuestions };
