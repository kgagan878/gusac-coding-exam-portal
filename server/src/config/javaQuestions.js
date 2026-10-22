/**
 * CODE VERSE with Java - Official Question Bank
 * Total Questions: 22 (Section A: 20 MCQs x 5 marks = 100 marks; Section B: 2 Coding x 25 marks = 50 marks)
 * Grand Total: 150 Marks
 */

const javaQuestions = [
  {
    "order": 1,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Type Casting & Integer Promotion",
    "topic": "Variables, Data Types & Type Casting",
    "difficulty": "Easy",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "public class Main {\n    public static void main(String[] args) {\n        byte b = 50;\n        b = (byte) (b * 2);\n        byte c = (byte) (b * 2);\n        System.out.println(b + \" \" + c);\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "100 200"
      },
      {
        "key": "B",
        "text": "100 -56"
      },
      {
        "key": "C",
        "text": "100 0"
      },
      {
        "key": "D",
        "text": "Compilation Error"
      }
    ],
    "correctOption": "B",
    "explanation": "In Java, a byte is an 8-bit signed integer with a range of -128 to 127. When b is 50, (byte)(50 * 2) = 100. Then (byte)(100 * 2) = (byte)200. Since 200 exceeds 127, it overflows in two's complement: 200 - 256 = -56. Thus, the output is \"100 -56\"."
  },
  {
    "order": 2,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Increment Operators Precedence",
    "topic": "Operators & Expressions",
    "difficulty": "Easy",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "public class Main {\n    public static void main(String[] args) {\n        int a = 5;\n        int b = a++ + ++a * a--;\n        System.out.println(\"a=\" + a + \", b=\" + b);\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "a=6, b=54"
      },
      {
        "key": "B",
        "text": "a=6, b=42"
      },
      {
        "key": "C",
        "text": "a=6, b=52"
      },
      {
        "key": "D",
        "text": "a=5, b=47"
      }
    ],
    "correctOption": "A",
    "explanation": "Evaluation proceeds from left to right with operator precedence (* before +): 1. a++ evaluates to 5, and a becomes 6. 2. ++a increments a to 7, evaluating to 7. 3. a-- evaluates to 7, and a becomes 6. 4. Multiplication happens: 7 * 7 = 49. 5. Addition happens: 5 + 49 = 54. Finally, a=6 and b=54."
  },
  {
    "order": 3,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "String Pool vs Heap & Immutability",
    "topic": "Strings & String Methods",
    "difficulty": "Medium",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "public class Main {\n    public static void main(String[] args) {\n        String s1 = \"GUSAC\";\n        String s2 = new String(\"GUSAC\");\n        String s3 = s2.intern();\n        s1.concat(\" 2026\");\n\n        System.out.println((s1 == s2) + \" \" + (s1 == s3) + \" \" + s1);\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "false true GUSAC 2026"
      },
      {
        "key": "B",
        "text": "false false GUSAC"
      },
      {
        "key": "C",
        "text": "false true GUSAC"
      },
      {
        "key": "D",
        "text": "true true GUSAC"
      }
    ],
    "correctOption": "C",
    "explanation": "1. s1 refers to the string literal in the String Constant Pool. 2. s2 refers to a new object created in heap memory, so s1 == s2 is false. 3. s2.intern() returns the canonical representation from the String Constant Pool (same reference as s1), so s1 == s3 is true. 4. Strings are immutable in Java. s1.concat(\" 2026\") creates a new String, but s1 remains unmodified (\"GUSAC\")."
  },
  {
    "order": 4,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Array Reference Passing in Methods",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "public class Main {\n    static void modify(int[] arr, int x) {\n        arr[0] = 99;\n        x = 50;\n        arr = new int[]{1, 2, 3};\n    }\n\n    public static void main(String[] args) {\n        int[] numbers = {10, 20};\n        int val = 5;\n        modify(numbers, val);\n        System.out.println(numbers[0] + \" \" + numbers[1] + \" \" + val);\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "1 2 5"
      },
      {
        "key": "B",
        "text": "99 20 5"
      },
      {
        "key": "C",
        "text": "99 20 50"
      },
      {
        "key": "D",
        "text": "10 20 5"
      }
    ],
    "correctOption": "B",
    "explanation": "Java passes all arguments by value. For object references (such as arrays), the copy of the reference is passed. 1. arr[0] = 99 modifies the original array object in heap, so numbers[0] becomes 99. 2. x = 50 modifies only the local primitive parameter, leaving val unchanged (5). 3. arr = new int[]{...} reassigns the local reference copy; it does not alter the caller's numbers reference. Thus: 99 20 5."
  },
  {
    "order": 5,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Nested Loops with Labeled Break",
    "topic": "Loops & Conditional Statements",
    "difficulty": "Medium",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "public class Main {\n    public static void main(String[] args) {\n        int sum = 0;\n        outer:\n        for (int i = 1; i <= 3; i++) {\n            for (int j = 1; j <= 3; j++) {\n                if (i == 2 && j == 2) {\n                    break outer;\n                }\n                sum += (i * j);\n            }\n        }\n        System.out.println(sum);\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "6"
      },
      {
        "key": "B",
        "text": "8"
      },
      {
        "key": "C",
        "text": "14"
      },
      {
        "key": "D",
        "text": "36"
      }
    ],
    "correctOption": "B",
    "explanation": "The loop iterations execute as follows: i=1, j=1: sum += 1*1 = 1 i=1, j=2: sum += 1*2 = 3 i=1, j=3: sum += 1*3 = 6 i=2, j=1: sum += 2*1 = 8 i=2, j=2: \"break outer\" terminates the outer loop immediately! The final sum printed is 8."
  },
  {
    "order": 6,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Recursive Method Call Order",
    "topic": "Methods & Recursion",
    "difficulty": "Medium",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "public class Main {\n    static void mystery(int n) {\n        if (n <= 0) return;\n        System.out.print(n + \" \");\n        mystery(n - 2);\n        System.out.print(n + \" \");\n    }\n\n    public static void main(String[] args) {\n        mystery(4);\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "4 2 0 0 2 4"
      },
      {
        "key": "B",
        "text": "4 2 2 4"
      },
      {
        "key": "C",
        "text": "4 2 4 2"
      },
      {
        "key": "D",
        "text": "2 4 2 4"
      }
    ],
    "correctOption": "B",
    "explanation": "Tracing mystery(4): 1. Prints \"4 \" 2. Calls mystery(2):    - Prints \"2 \"    - Calls mystery(0): base case (n <= 0) returns immediately.    - Prints \"2 \" 3. Resumes mystery(4) and prints \"4 \". Total output printed: \"4 2 2 4 \"."
  },
  {
    "order": 7,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Object Mutation via References",
    "topic": "Object-Oriented Programming",
    "difficulty": "Easy",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "class Student {\n    int score = 80;\n}\n\npublic class Main {\n    static void test(Student s1, Student s2) {\n        s1.score = 95;\n        s2 = new Student();\n        s2.score = 60;\n    }\n\n    public static void main(String[] args) {\n        Student a = new Student();\n        Student b = new Student();\n        test(a, b);\n        System.out.println(a.score + \" \" + b.score);\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "95 60"
      },
      {
        "key": "B",
        "text": "80 80"
      },
      {
        "key": "C",
        "text": "95 80"
      },
      {
        "key": "D",
        "text": "80 60"
      }
    ],
    "correctOption": "C",
    "explanation": "s1 receives a copy of reference a. Mutating s1.score changes a.score to 95. s2 receives a copy of reference b. But s2 is then reassigned to a new Student object, so modifying s2.score modifies only the newly created object. Reference b in main remains unchanged with score 80. Result is \"95 80\"."
  },
  {
    "order": 8,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Dynamic Method Dispatch & Polymorphism",
    "topic": "Inheritance & Polymorphism",
    "difficulty": "Medium",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "class Parent {\n    void show() {\n        System.out.print(\"Parent \");\n    }\n}\n\nclass Child extends Parent {\n    @Override\n    void show() {\n        System.out.print(\"Child \");\n    }\n    void play() {\n        System.out.print(\"Play \");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Parent p = new Child();\n        p.show();\n        ((Child) p).play();\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "Parent Play"
      },
      {
        "key": "B",
        "text": "Child Play"
      },
      {
        "key": "C",
        "text": "Compilation Error"
      },
      {
        "key": "D",
        "text": "ClassCastException"
      }
    ],
    "correctOption": "B",
    "explanation": "p is a reference of type Parent pointing to an instance of Child. In Java, instance method calls are resolved at runtime based on the actual object (dynamic method dispatch), so p.show() invokes Child's show() (\"Child \"). Casting p to ((Child) p) allows calling play(), which prints \"Play \". Output is \"Child Play \"."
  },
  {
    "order": 9,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Constructor Chaining with this() and super()",
    "topic": "Constructors & Method Overloading",
    "difficulty": "Medium",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "class Base {\n    Base() {\n        System.out.print(\"Base \");\n    }\n    Base(String msg) {\n        this();\n        System.out.print(msg + \" \");\n    }\n}\n\nclass Derived extends Base {\n    Derived() {\n        super(\"Init\");\n        System.out.print(\"Derived \");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Derived();\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "Derived Init Base"
      },
      {
        "key": "B",
        "text": "Base Init Derived"
      },
      {
        "key": "C",
        "text": "Init Base Derived"
      },
      {
        "key": "D",
        "text": "Compilation Error"
      }
    ],
    "correctOption": "B",
    "explanation": "Execution sequence: 1. new Derived() invokes Derived() constructor. 2. First statement in Derived() is super(\"Init\"), which calls Base(String). 3. First statement in Base(String) is this(), which calls Base(). 4. Base() constructor executes and prints \"Base \". 5. Base(String) finishes and prints \"Init \". 6. Derived() finishes and prints \"Derived \". Total output: \"Base Init Derived \"."
  },
  {
    "order": 10,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Exception Handling & Finally Return Flow",
    "topic": "Exception Handling",
    "difficulty": "Hard",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "public class Main {\n    static int calculate() {\n        try {\n            int a = 10 / 0;\n            return 1;\n        } catch (ArithmeticException e) {\n            return 2;\n        } finally {\n            return 3;\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(calculate());\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "1"
      },
      {
        "key": "B",
        "text": "2"
      },
      {
        "key": "C",
        "text": "3"
      },
      {
        "key": "D",
        "text": "ArithmeticException unhandled"
      }
    ],
    "correctOption": "C",
    "explanation": "In Java, a return statement inside a finally block always executes and overrides any previous return statement or unhandled exception from the try or catch blocks. 10/0 throws an ArithmeticException, caught in the catch block returning 2, but finally executes and returns 3."
  },
  {
    "order": 11,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "ArrayList remove(int) vs remove(Object)",
    "topic": "Collections Basics",
    "difficulty": "Medium",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        list.add(1);\n        list.add(2);\n        list.add(3);\n\n        list.remove(1);\n        list.remove(Integer.valueOf(3));\n\n        System.out.println(list);\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "[2]"
      },
      {
        "key": "B",
        "text": "[1]"
      },
      {
        "key": "C",
        "text": "[3]"
      },
      {
        "key": "D",
        "text": "[1, 2]"
      }
    ],
    "correctOption": "B",
    "explanation": "In ArrayList<Integer>, the method remove(int index) is overloaded with remove(Object o). 1. list.remove(1) matches the primitive int overload remove(int index), which removes the element at index 1 (value 2). List is now [1, 3]. 2. list.remove(Integer.valueOf(3)) matches remove(Object), which removes the element with value 3. List is now [1]. Output is \"[1]\"."
  },
  {
    "order": 12,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Static Block & Static Variable Initialization Order",
    "topic": "Static Variables & Methods",
    "difficulty": "Medium",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "class Counter {\n    static int count = 10;\n    static {\n        count += 5;\n    }\n    {\n        count += 2;\n    }\n    Counter() {\n        count += 3;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.print(Counter.count + \" \");\n        Counter c = new Counter();\n        System.out.print(c.count);\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "10 15"
      },
      {
        "key": "B",
        "text": "15 20"
      },
      {
        "key": "C",
        "text": "15 15"
      },
      {
        "key": "D",
        "text": "10 20"
      }
    ],
    "correctOption": "B",
    "explanation": "When Counter is first referenced via Counter.count, the class is loaded: 1. static count = 10; 2. static block executes: count += 5 (count is now 15). First print outputs: \"15 \". When new Counter() is called: 3. Instance initializer block executes: count += 2 (count is now 17). 4. Constructor executes: count += 3 (count is now 20). Second print outputs: \"20\". Total: \"15 20\"."
  },
  {
    "order": 13,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "String Concatenation & Integer Addition Order",
    "topic": "Java Output Prediction",
    "difficulty": "Easy",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(10 + 20 + \"GUSAC\" + 10 + 20);\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "30GUSAC30"
      },
      {
        "key": "B",
        "text": "1020GUSAC1020"
      },
      {
        "key": "C",
        "text": "30GUSAC1020"
      },
      {
        "key": "D",
        "text": "Compilation Error"
      }
    ],
    "correctOption": "C",
    "explanation": "The + operator is left-associative: 1. 10 + 20 evaluates to integer addition = 30. 2. 30 + \"GUSAC\" evaluates to string concatenation = \"30GUSAC\". 3. \"30GUSAC\" + 10 evaluates to string concatenation = \"30GUSAC10\". 4. \"30GUSAC10\" + 20 evaluates to string concatenation = \"30GUSAC1020\"."
  },
  {
    "order": 14,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Bitwise Operators & Logic",
    "topic": "Basic Algorithm & Logical Reasoning",
    "difficulty": "Medium",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "public class Main {\n    public static void main(String[] args) {\n        int x = 5;  // 0101 in binary\n        int y = 3;  // 0011 in binary\n        int andVal = x & y;\n        int orVal = x | y;\n        int xorVal = x ^ y;\n        System.out.println(andVal + \" \" + orVal + \" \" + xorVal);\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "1 7 6"
      },
      {
        "key": "B",
        "text": "1 7 2"
      },
      {
        "key": "C",
        "text": "2 8 6"
      },
      {
        "key": "D",
        "text": "1 5 3"
      }
    ],
    "correctOption": "A",
    "explanation": "Binary representations: x = 0101, y = 0011. Bitwise AND (x & y): 0101 & 0011 = 0001 (1). Bitwise OR (x | y): 0101 | 0011 = 0111 (7). Bitwise XOR (x ^ y): 0101 ^ 0011 = 0110 (6). Output is \"1 7 6\"."
  },
  {
    "order": 15,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Integer Autoboxing & Cache Mechanism",
    "topic": "Variables, Data Types & Type Casting",
    "difficulty": "Medium",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "public class Main {\n    public static void main(String[] args) {\n        Integer a = 127;\n        Integer b = 127;\n        Integer c = 128;\n        Integer d = 128;\n        System.out.println((a == b) + \" \" + (c == d));\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "true true"
      },
      {
        "key": "B",
        "text": "false false"
      },
      {
        "key": "C",
        "text": "true false"
      },
      {
        "key": "D",
        "text": "false true"
      }
    ],
    "correctOption": "C",
    "explanation": "Java caches Integer objects within the range of -128 to 127 (inclusive) via IntegerCache. Therefore, autoboxing 127 returns the exact same cached reference (a == b is true). For values >= 128, new distinct Integer objects are allocated on the heap, so c == d compares memory references and returns false. Output is \"true false\"."
  },
  {
    "order": 16,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Variables are NOT Polymorphic in Java",
    "topic": "Inheritance & Polymorphism",
    "difficulty": "Hard",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "class SuperClass {\n    int value = 10;\n    int getValue() { return value; }\n}\n\nclass SubClass extends SuperClass {\n    int value = 20;\n    @Override\n    int getValue() { return value; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        SuperClass obj = new SubClass();\n        System.out.println(obj.value + \" \" + obj.getValue());\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "20 20"
      },
      {
        "key": "B",
        "text": "10 20"
      },
      {
        "key": "C",
        "text": "10 10"
      },
      {
        "key": "D",
        "text": "20 10"
      }
    ],
    "correctOption": "B",
    "explanation": "In Java, instance variables are NOT polymorphic (variable hiding occurs, not overriding). Direct field access obj.value is resolved at compile time based on the reference type (SuperClass), yielding 10. Method calls obj.getValue() are resolved dynamically at runtime on the actual object (SubClass), yielding 20. Output: \"10 20\"."
  },
  {
    "order": 17,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "StringBuilder Capacity & Length",
    "topic": "Strings & String Methods",
    "difficulty": "Medium",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "public class Main {\n    public static void main(String[] args) {\n        StringBuilder sb = new StringBuilder(\"GUSAC\");\n        sb.append(\"-EXAM\");\n        sb.delete(5, 6);\n        System.out.println(sb + \" \" + sb.length());\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "GUSACEXAM 9"
      },
      {
        "key": "B",
        "text": "GUSAC-EXAM 10"
      },
      {
        "key": "C",
        "text": "GUSACEXAM 10"
      },
      {
        "key": "D",
        "text": "GUSAC 5"
      }
    ],
    "correctOption": "A",
    "explanation": "1. StringBuilder starts with \"GUSAC\". 2. append(\"-EXAM\") makes it \"GUSAC-EXAM\" (length 10). 3. delete(start, end) removes characters from index start to end - 1. Here, delete(5, 6) removes index 5 (the hyphen \"-\"). 4. The string becomes \"GUSACEXAM\" and its length is 9. Output: \"GUSACEXAM 9\"."
  },
  {
    "order": 18,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Static Method Hiding vs Overriding",
    "topic": "Static Variables & Methods",
    "difficulty": "Hard",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "class Vehicle {\n    static void display() {\n        System.out.print(\"Vehicle \");\n    }\n}\n\nclass Car extends Vehicle {\n    static void display() {\n        System.out.print(\"Car \");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Vehicle v = new Car();\n        v.display();\n        Car c = new Car();\n        c.display();\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "Car Car"
      },
      {
        "key": "B",
        "text": "Vehicle Car"
      },
      {
        "key": "C",
        "text": "Vehicle Vehicle"
      },
      {
        "key": "D",
        "text": "Compilation Error"
      }
    ],
    "correctOption": "B",
    "explanation": "Static methods cannot be overridden; they can only be hidden. Static method resolution happens at compile time based on the declared reference type. Since reference v is declared as Vehicle, v.display() calls Vehicle.display() (\"Vehicle \"). Reference c is declared as Car, so c.display() calls Car.display() (\"Car \"). Result is \"Vehicle Car \"."
  },
  {
    "order": 19,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Short-Circuit Logical Evaluation",
    "topic": "Operators & Expressions",
    "difficulty": "Easy",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "public class Main {\n    public static void main(String[] args) {\n        int x = 10;\n        int y = 20;\n        if (++x > 10 || ++y > 20) {\n            x++;\n        }\n        System.out.println(\"x=\" + x + \", y=\" + y);\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "x=12, y=21"
      },
      {
        "key": "B",
        "text": "x=11, y=20"
      },
      {
        "key": "C",
        "text": "x=12, y=20"
      },
      {
        "key": "D",
        "text": "x=11, y=21"
      }
    ],
    "correctOption": "C",
    "explanation": "1. ++x increments x from 10 to 11. The expression 11 > 10 evaluates to true. 2. Because || is a short-circuit operator, the second condition (++y > 20) is completely skipped! Thus, y remains 20. 3. The if condition is true, so x++ executes, incrementing x from 11 to 12. Output is \"x=12, y=20\"."
  },
  {
    "order": 20,
    "section": "A",
    "type": "mcq",
    "marks": 5,
    "title": "Switch Statement Fallthrough with Break",
    "topic": "Loops & Conditional Statements",
    "difficulty": "Medium",
    "description": "What will be the output of the following Java program?",
    "codeSnippet": "public class Main {\n    public static void main(String[] args) {\n        int code = 2;\n        int points = 0;\n        switch (code) {\n            case 1:\n                points += 10;\n            case 2:\n                points += 20;\n            case 3:\n                points += 30;\n                break;\n            case 4:\n                points += 40;\n            default:\n                points += 50;\n        }\n        System.out.println(points);\n    }\n}",
    "options": [
      {
        "key": "A",
        "text": "20"
      },
      {
        "key": "B",
        "text": "50"
      },
      {
        "key": "C",
        "text": "140"
      },
      {
        "key": "D",
        "text": "150"
      }
    ],
    "correctOption": "B",
    "explanation": "Matching starts at case 2 (points += 20). Because there is no break statement on case 2, execution falls through into case 3 (points += 30, making points = 50). Case 3 has a break statement, which immediately exits the switch construct. The final value printed is 50."
  },
  {
    "order": 21,
    "section": "B",
    "type": "coding",
    "marks": 25,
    "title": "Character Frequency Sorter",
    "topic": "Strings & HashMaps",
    "difficulty": "Medium",
    "description": "Write a Java program that reads a string from standard input, counts the frequency of each alphabetical character (case-insensitive), and prints each distinct character along with its count in alphabetical order formatted as \"char:count\" separated by spaces. Ignore non-alphabetic characters and spaces.",
    "inputFormat": "A single line containing the string S.",
    "outputFormat": "Space-separated lowercase character frequency pairs in alphabetical order, e.g., \"a:3 b:1 n:2\".",
    "constraints": "1 <= S.length <= 10^5. Characters are ASCII.",
    "starterCode": {
      "java": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (!scanner.hasNextLine()) return;\n        String input = scanner.nextLine();\n        \n        int[] freq = new int[26];\n        for (char ch : input.toLowerCase().toCharArray()) {\n            if (ch >= 'a' && ch <= 'z') {\n                freq[ch - 'a']++;\n            }\n        }\n        \n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < 26; i++) {\n            if (freq[i] > 0) {\n                if (sb.length() > 0) sb.append(\" \");\n                sb.append((char)('a' + i)).append(\":\").append(freq[i]);\n            }\n        }\n        \n        System.out.println(sb.toString());\n    }\n}"
    },
    "sampleTestCases": [
      {
        "input": "banana",
        "expectedOutput": "a:3 b:1 n:2",
        "explanation": "Characters in banana: a appears 3 times, b appears 1 time, n appears 2 times."
      },
      {
        "input": "gusac",
        "expectedOutput": "a:1 c:1 g:1 s:1 u:1",
        "explanation": "Characters in gusac sorted alphabetically with count 1 each."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "gitam university",
        "expectedOutput": "a:2 e:1 g:1 i:3 m:1 n:1 r:1 s:1 t:2 u:1 v:1 y:1",
        "explanation": "Case insensitive character count excluding space."
      },
      {
        "input": "codeverse",
        "expectedOutput": "c:1 d:1 e:3 o:1 r:1 s:1 v:1",
        "explanation": "Alphabetical frequency for codeverse."
      },
      {
        "input": "Java SE 17!",
        "expectedOutput": "a:2 e:1 j:1 s:1 v:1",
        "explanation": "Digits and punctuation are ignored."
      }
    ]
  },
  {
    "order": 22,
    "section": "B",
    "type": "coding",
    "marks": 25,
    "title": "Pairs with Target Difference",
    "topic": "Arrays & Searching Algorithms",
    "difficulty": "Medium",
    "description": "Given an array of integers and a non-negative target difference K, find and print the total number of unique pairs (A, B) such that A - B = K, where A >= B.",
    "inputFormat": "First line: Integer N (size of array).\nSecond line: N space-separated integers.\nThird line: Integer K (target difference).",
    "outputFormat": "Print a single integer: the count of distinct pairs with difference K.",
    "constraints": "1 <= N <= 10^5, -10^6 <= arr[i] <= 10^6, 0 <= K <= 10^6.",
    "starterCode": {
      "java": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (!scanner.hasNextInt()) return;\n        int n = scanner.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = scanner.nextInt();\n        }\n        int k = scanner.nextInt();\n        \n        Set<Integer> set = new HashSet<>();\n        for (int num : arr) {\n            set.add(num);\n        }\n        \n        int count = 0;\n        if (k == 0) {\n            Map<Integer, Integer> freq = new HashMap<>();\n            for (int num : arr) freq.put(num, freq.getOrDefault(num, 0) + 1);\n            for (int c : freq.values()) {\n                if (c > 1) count++;\n            }\n        } else {\n            for (int num : set) {\n                if (set.contains(num + k)) {\n                    count++;\n                }\n            }\n        }\n        \n        System.out.println(count);\n    }\n}"
    },
    "sampleTestCases": [
      {
        "input": "5\n1 5 3 4 2\n2",
        "expectedOutput": "3",
        "explanation": "Pairs with difference 2: (3, 1), (4, 2), (5, 3). Count = 3."
      },
      {
        "input": "4\n8 12 16 4\n4",
        "expectedOutput": "3",
        "explanation": "Pairs with difference 4: (8, 4), (12, 8), (16, 12). Count = 3."
      }
    ],
    "hiddenTestCases": [
      {
        "input": "6\n1 3 5 8 6 4\n2",
        "expectedOutput": "4",
        "explanation": "Pairs with difference 2: (3,1), (5,3), (6,4), (8,6)."
      },
      {
        "input": "5\n1 2 3 2 1\n0",
        "expectedOutput": "2",
        "explanation": "Duplicates with difference 0: 1 and 2 appear more than once."
      },
      {
        "input": "6\n10 20 30 40 50 60\n20",
        "expectedOutput": "4",
        "explanation": "Pairs with difference 20: (30,10), (40,20), (50,30), (60,40)."
      }
    ]
  }
];

module.exports = { javaQuestions };
