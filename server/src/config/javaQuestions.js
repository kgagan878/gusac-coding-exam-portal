/**
 * 20 Verified Java Output Prediction & Code Snippet Multiple-Choice Questions
 * Covering all syllabus topics: Data Types, Operators, Strings, Arrays, Loops,
 * Methods, OOP, Inheritance, Polymorphism, Constructors, Exceptions, Collections,
 * Statics, Algorithms/Bitwise, etc.
 */

const javaQuestions = [
  {
    order: 1,
    title: 'Type Casting & Integer Promotion',
    topic: 'Variables, Data Types & Type Casting',
    difficulty: 'Easy',
    marks: 1,
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
    explanation:
      'In Java, a byte is an 8-bit signed integer with a range of -128 to 127. When b is 50, (byte)(50 * 2) = 100. Then (byte)(100 * 2) = (byte)200. Since 200 exceeds 127, it overflows in two\'s complement: 200 - 256 = -56. Thus, the output is "100 -56".',
  },
  {
    order: 2,
    title: 'Increment Operators Precedence',
    topic: 'Operators & Expressions',
    difficulty: 'Easy',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        int a = 5;
        int b = a++ + ++a * a--;
        System.out.println("a=" + a + ", b=" + b);
    }
}`,
    options: [
      { key: 'A', text: 'a=6, b=54' },
      { key: 'B', text: 'a=6, b=42' },
      { key: 'C', text: 'a=6, b=52' },
      { key: 'D', text: 'a=5, b=47' },
    ],
    correctOption: 'A',
    explanation:
      'Evaluation proceeds from left to right with operator precedence (* before +): ' +
      '1. a++ evaluates to 5, and a becomes 6. ' +
      '2. ++a increments a to 7, evaluating to 7. ' +
      '3. a-- evaluates to 7, and a becomes 6. ' +
      '4. Multiplication happens: 7 * 7 = 49. ' +
      '5. Addition happens: 5 + 49 = 54. Finally, a=6 and b=54.',
  },
  {
    order: 3,
    title: 'String Pool vs Heap & Immutability',
    topic: 'Strings & String Methods',
    difficulty: 'Medium',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        String s1 = "GUSAC";
        String s2 = new String("GUSAC");
        String s3 = s2.intern();
        s1.concat(" 2026");

        System.out.println((s1 == s2) + " " + (s1 == s3) + " " + s1);
    }
}`,
    options: [
      { key: 'A', text: 'false true GUSAC 2026' },
      { key: 'B', text: 'false false GUSAC' },
      { key: 'C', text: 'false true GUSAC' },
      { key: 'D', text: 'true true GUSAC' },
    ],
    correctOption: 'C',
    explanation:
      '1. s1 refers to the string literal in the String Constant Pool. ' +
      '2. s2 refers to a new object created in heap memory, so s1 == s2 is false. ' +
      '3. s2.intern() returns the canonical representation from the String Constant Pool (same reference as s1), so s1 == s3 is true. ' +
      '4. Strings are immutable in Java. s1.concat(" 2026") creates a new String, but s1 remains unmodified ("GUSAC").',
  },
  {
    order: 4,
    title: 'Array Reference Passing in Methods',
    topic: 'Arrays',
    difficulty: 'Easy',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    static void modify(int[] arr, int x) {
        arr[0] = 99;
        x = 50;
        arr = new int[]{1, 2, 3};
    }

    public static void main(String[] args) {
        int[] numbers = {10, 20};
        int val = 5;
        modify(numbers, val);
        System.out.println(numbers[0] + " " + numbers[1] + " " + val);
    }
}`,
    options: [
      { key: 'A', text: '1 2 5' },
      { key: 'B', text: '99 20 5' },
      { key: 'C', text: '99 20 50' },
      { key: 'D', text: '10 20 5' },
    ],
    correctOption: 'B',
    explanation:
      'Java passes all arguments by value. For object references (such as arrays), the copy of the reference is passed. ' +
      '1. arr[0] = 99 modifies the original array object in heap, so numbers[0] becomes 99. ' +
      '2. x = 50 modifies only the local primitive parameter, leaving val unchanged (5). ' +
      '3. arr = new int[]{...} reassigns the local reference copy; it does not alter the caller\'s numbers reference. Thus: 99 20 5.',
  },
  {
    order: 5,
    title: 'Nested Loops with Labeled Break',
    topic: 'Loops & Conditional Statements',
    difficulty: 'Medium',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        int sum = 0;
        outer:
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                if (i == 2 && j == 2) {
                    break outer;
                }
                sum += (i * j);
            }
        }
        System.out.println(sum);
    }
}`,
    options: [
      { key: 'A', text: '6' },
      { key: 'B', text: '8' },
      { key: 'C', text: '14' },
      { key: 'D', text: '36' },
    ],
    correctOption: 'B',
    explanation:
      'The loop iterations execute as follows: ' +
      'i=1, j=1: sum += 1*1 = 1 ' +
      'i=1, j=2: sum += 1*2 = 3 ' +
      'i=1, j=3: sum += 1*3 = 6 ' +
      'i=2, j=1: sum += 2*1 = 8 ' +
      'i=2, j=2: "break outer" terminates the outer loop immediately! ' +
      'The final sum printed is 8.',
  },
  {
    order: 6,
    title: 'Recursive Method Call Order',
    topic: 'Methods & Recursion',
    difficulty: 'Medium',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    static void mystery(int n) {
        if (n <= 0) return;
        System.out.print(n + " ");
        mystery(n - 2);
        System.out.print(n + " ");
    }

    public static void main(String[] args) {
        mystery(4);
    }
}`,
    options: [
      { key: 'A', text: '4 2 0 0 2 4' },
      { key: 'B', text: '4 2 2 4' },
      { key: 'C', text: '4 2 4 2' },
      { key: 'D', text: '2 4 2 4' },
    ],
    correctOption: 'B',
    explanation:
      'Tracing mystery(4): ' +
      '1. Prints "4 " ' +
      '2. Calls mystery(2): ' +
      '   - Prints "2 " ' +
      '   - Calls mystery(0): base case (n <= 0) returns immediately. ' +
      '   - Prints "2 " ' +
      '3. Resumes mystery(4) and prints "4 ". ' +
      'Total output printed: "4 2 2 4 ".',
  },
  {
    order: 7,
    title: 'Object Mutation via References',
    topic: 'Object-Oriented Programming',
    difficulty: 'Easy',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `class Student {
    int score = 80;
}

public class Main {
    static void test(Student s1, Student s2) {
        s1.score = 95;
        s2 = new Student();
        s2.score = 60;
    }

    public static void main(String[] args) {
        Student a = new Student();
        Student b = new Student();
        test(a, b);
        System.out.println(a.score + " " + b.score);
    }
}`,
    options: [
      { key: 'A', text: '95 60' },
      { key: 'B', text: '80 80' },
      { key: 'C', text: '95 80' },
      { key: 'D', text: '80 60' },
    ],
    correctOption: 'C',
    explanation:
      's1 receives a copy of reference a. Mutating s1.score changes a.score to 95. ' +
      's2 receives a copy of reference b. But s2 is then reassigned to a new Student object, so modifying s2.score modifies only the newly created object. Reference b in main remains unchanged with score 80. Result is "95 80".',
  },
  {
    order: 8,
    title: 'Dynamic Method Dispatch & Polymorphism',
    topic: 'Inheritance & Polymorphism',
    difficulty: 'Medium',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `class Parent {
    void show() {
        System.out.print("Parent ");
    }
}

class Child extends Parent {
    @Override
    void show() {
        System.out.print("Child ");
    }
    void play() {
        System.out.print("Play ");
    }
}

public class Main {
    public static void main(String[] args) {
        Parent p = new Child();
        p.show();
        ((Child) p).play();
    }
}`,
    options: [
      { key: 'A', text: 'Parent Play' },
      { key: 'B', text: 'Child Play' },
      { key: 'C', text: 'Compilation Error' },
      { key: 'D', text: 'ClassCastException' },
    ],
    correctOption: 'B',
    explanation:
      'p is a reference of type Parent pointing to an instance of Child. In Java, instance method calls are resolved at runtime based on the actual object (dynamic method dispatch), so p.show() invokes Child\'s show() ("Child "). ' +
      'Casting p to ((Child) p) allows calling play(), which prints "Play ". Output is "Child Play ".',
  },
  {
    order: 9,
    title: 'Constructor Chaining with this() and super()',
    topic: 'Constructors & Method Overloading',
    difficulty: 'Medium',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `class Base {
    Base() {
        System.out.print("Base ");
    }
    Base(String msg) {
        this();
        System.out.print(msg + " ");
    }
}

class Derived extends Base {
    Derived() {
        super("Init");
        System.out.print("Derived ");
    }
}

public class Main {
    public static void main(String[] args) {
        new Derived();
    }
}`,
    options: [
      { key: 'A', text: 'Derived Init Base' },
      { key: 'B', text: 'Base Init Derived' },
      { key: 'C', text: 'Init Base Derived' },
      { key: 'D', text: 'Compilation Error' },
    ],
    correctOption: 'B',
    explanation:
      'Execution sequence: ' +
      '1. new Derived() invokes Derived() constructor. ' +
      '2. First statement in Derived() is super("Init"), which calls Base(String). ' +
      '3. First statement in Base(String) is this(), which calls Base(). ' +
      '4. Base() constructor executes and prints "Base ". ' +
      '5. Base(String) finishes and prints "Init ". ' +
      '6. Derived() finishes and prints "Derived ". Total output: "Base Init Derived ".',
  },
  {
    order: 10,
    title: 'Exception Handling & Finally Return Flow',
    topic: 'Exception Handling',
    difficulty: 'Hard',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    static int calculate() {
        try {
            int a = 10 / 0;
            return 1;
        } catch (ArithmeticException e) {
            return 2;
        } finally {
            return 3;
        }
    }

    public static void main(String[] args) {
        System.out.println(calculate());
    }
}`,
    options: [
      { key: 'A', text: '1' },
      { key: 'B', text: '2' },
      { key: 'C', text: '3' },
      { key: 'D', text: 'ArithmeticException unhandled' },
    ],
    correctOption: 'C',
    explanation:
      'In Java, a return statement inside a finally block always executes and overrides any previous return statement or unhandled exception from the try or catch blocks. 10/0 throws an ArithmeticException, caught in the catch block returning 2, but finally executes and returns 3.',
  },
  {
    order: 11,
    title: 'ArrayList remove(int) vs remove(Object)',
    topic: 'Collections Basics',
    difficulty: 'Medium',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);

        list.remove(1);
        list.remove(Integer.valueOf(3));

        System.out.println(list);
    }
}`,
    options: [
      { key: 'A', text: '[2]' },
      { key: 'B', text: '[1]' },
      { key: 'C', text: '[3]' },
      { key: 'D', text: '[1, 2]' },
    ],
    correctOption: 'B',
    explanation:
      'In ArrayList<Integer>, the method remove(int index) is overloaded with remove(Object o). ' +
      '1. list.remove(1) matches the primitive int overload remove(int index), which removes the element at index 1 (value 2). List is now [1, 3]. ' +
      '2. list.remove(Integer.valueOf(3)) matches remove(Object), which removes the element with value 3. ' +
      'List is now [1]. Output is "[1]".',
  },
  {
    order: 12,
    title: 'Static Block & Static Variable Initialization Order',
    topic: 'Static Variables & Methods',
    difficulty: 'Medium',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `class Counter {
    static int count = 10;
    static {
        count += 5;
    }
    {
        count += 2;
    }
    Counter() {
        count += 3;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.print(Counter.count + " ");
        Counter c = new Counter();
        System.out.print(c.count);
    }
}`,
    options: [
      { key: 'A', text: '10 15' },
      { key: 'B', text: '15 20' },
      { key: 'C', text: '15 15' },
      { key: 'D', text: '10 20' },
    ],
    correctOption: 'B',
    explanation:
      'When Counter is first referenced via Counter.count, the class is loaded: ' +
      '1. static count = 10; ' +
      '2. static block executes: count += 5 (count is now 15). ' +
      'First print outputs: "15 ". ' +
      'When new Counter() is called: ' +
      '3. Instance initializer block executes: count += 2 (count is now 17). ' +
      '4. Constructor executes: count += 3 (count is now 20). ' +
      'Second print outputs: "20". Total: "15 20".',
  },
  {
    order: 13,
    title: 'String Concatenation & Integer Addition Order',
    topic: 'Java Output Prediction',
    difficulty: 'Easy',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println(10 + 20 + "GUSAC" + 10 + 20);
    }
}`,
    options: [
      { key: 'A', text: '30GUSAC30' },
      { key: 'B', text: '1020GUSAC1020' },
      { key: 'C', text: '30GUSAC1020' },
      { key: 'D', text: 'Compilation Error' },
    ],
    correctOption: 'C',
    explanation:
      'The + operator is left-associative: ' +
      '1. 10 + 20 evaluates to integer addition = 30. ' +
      '2. 30 + "GUSAC" evaluates to string concatenation = "30GUSAC". ' +
      '3. "30GUSAC" + 10 evaluates to string concatenation = "30GUSAC10". ' +
      '4. "30GUSAC10" + 20 evaluates to string concatenation = "30GUSAC1020".',
  },
  {
    order: 14,
    title: 'Bitwise Operators & Logic',
    topic: 'Basic Algorithm & Logical Reasoning',
    difficulty: 'Medium',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        int x = 5;  // 0101 in binary
        int y = 3;  // 0011 in binary
        int andVal = x & y;
        int orVal = x | y;
        int xorVal = x ^ y;
        System.out.println(andVal + " " + orVal + " " + xorVal);
    }
}`,
    options: [
      { key: 'A', text: '1 7 6' },
      { key: 'B', text: '1 7 2' },
      { key: 'C', text: '2 8 6' },
      { key: 'D', text: '1 5 3' },
    ],
    correctOption: 'A',
    explanation:
      'Binary representations: x = 0101, y = 0011. ' +
      'Bitwise AND (x & y): 0101 & 0011 = 0001 (1). ' +
      'Bitwise OR (x | y): 0101 | 0011 = 0111 (7). ' +
      'Bitwise XOR (x ^ y): 0101 ^ 0011 = 0110 (6). ' +
      'Output is "1 7 6".',
  },
  {
    order: 15,
    title: 'Integer Autoboxing & Cache Mechanism',
    topic: 'Variables, Data Types & Type Casting',
    difficulty: 'Medium',
    marks: 1,
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
    explanation:
      'Java caches Integer objects within the range of -128 to 127 (inclusive) via IntegerCache. ' +
      'Therefore, autoboxing 127 returns the exact same cached reference (a == b is true). ' +
      'For values >= 128, new distinct Integer objects are allocated on the heap, so c == d compares memory references and returns false. Output is "true false".',
  },
  {
    order: 16,
    title: 'Variables are NOT Polymorphic in Java',
    topic: 'Inheritance & Polymorphism',
    difficulty: 'Hard',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `class SuperClass {
    int value = 10;
    int getValue() { return value; }
}

class SubClass extends SuperClass {
    int value = 20;
    @Override
    int getValue() { return value; }
}

public class Main {
    public static void main(String[] args) {
        SuperClass obj = new SubClass();
        System.out.println(obj.value + " " + obj.getValue());
    }
}`,
    options: [
      { key: 'A', text: '20 20' },
      { key: 'B', text: '10 20' },
      { key: 'C', text: '10 10' },
      { key: 'D', text: '20 10' },
    ],
    correctOption: 'B',
    explanation:
      'In Java, instance variables are NOT polymorphic (variable hiding occurs, not overriding). ' +
      'Direct field access obj.value is resolved at compile time based on the reference type (SuperClass), yielding 10. ' +
      'Method calls obj.getValue() are resolved dynamically at runtime on the actual object (SubClass), yielding 20. Output: "10 20".',
  },
  {
    order: 17,
    title: 'StringBuilder Capacity & Length',
    topic: 'Strings & String Methods',
    difficulty: 'Medium',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("GUSAC");
        sb.append("-EXAM");
        sb.delete(5, 6);
        System.out.println(sb + " " + sb.length());
    }
}`,
    options: [
      { key: 'A', text: 'GUSACEXAM 9' },
      { key: 'B', text: 'GUSAC-EXAM 10' },
      { key: 'C', text: 'GUSACEXAM 10' },
      { key: 'D', text: 'GUSAC 5' },
    ],
    correctOption: 'A',
    explanation:
      '1. StringBuilder starts with "GUSAC". ' +
      '2. append("-EXAM") makes it "GUSAC-EXAM" (length 10). ' +
      '3. delete(start, end) removes characters from index start to end - 1. Here, delete(5, 6) removes index 5 (the hyphen "-"). ' +
      '4. The string becomes "GUSACEXAM" and its length is 9. Output: "GUSACEXAM 9".',
  },
  {
    order: 18,
    title: 'Static Method Hiding vs Overriding',
    topic: 'Static Variables & Methods',
    difficulty: 'Hard',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `class Vehicle {
    static void display() {
        System.out.print("Vehicle ");
    }
}

class Car extends Vehicle {
    static void display() {
        System.out.print("Car ");
    }
}

public class Main {
    public static void main(String[] args) {
        Vehicle v = new Car();
        v.display();
        Car c = new Car();
        c.display();
    }
}`,
    options: [
      { key: 'A', text: 'Car Car' },
      { key: 'B', text: 'Vehicle Car' },
      { key: 'C', text: 'Vehicle Vehicle' },
      { key: 'D', text: 'Compilation Error' },
    ],
    correctOption: 'B',
    explanation:
      'Static methods cannot be overridden; they can only be hidden. Static method resolution happens at compile time based on the declared reference type. ' +
      'Since reference v is declared as Vehicle, v.display() calls Vehicle.display() ("Vehicle "). ' +
      'Reference c is declared as Car, so c.display() calls Car.display() ("Car "). Result is "Vehicle Car ".',
  },
  {
    order: 19,
    title: 'Short-Circuit Logical Evaluation',
    topic: 'Operators & Expressions',
    difficulty: 'Easy',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        int x = 10;
        int y = 20;
        if (++x > 10 || ++y > 20) {
            x++;
        }
        System.out.println("x=" + x + ", y=" + y);
    }
}`,
    options: [
      { key: 'A', text: 'x=12, y=21' },
      { key: 'B', text: 'x=11, y=20' },
      { key: 'C', text: 'x=12, y=20' },
      { key: 'D', text: 'x=11, y=21' },
    ],
    correctOption: 'C',
    explanation:
      '1. ++x increments x from 10 to 11. The expression 11 > 10 evaluates to true. ' +
      '2. Because || is a short-circuit operator, the second condition (++y > 20) is completely skipped! Thus, y remains 20. ' +
      '3. The if condition is true, so x++ executes, incrementing x from 11 to 12. ' +
      'Output is "x=12, y=20".',
  },
  {
    order: 20,
    title: 'Switch Statement Fallthrough with Break',
    topic: 'Loops & Conditional Statements',
    difficulty: 'Medium',
    marks: 1,
    description: 'What will be the output of the following Java program?',
    codeSnippet: `public class Main {
    public static void main(String[] args) {
        int code = 2;
        int points = 0;
        switch (code) {
            case 1:
                points += 10;
            case 2:
                points += 20;
            case 3:
                points += 30;
                break;
            case 4:
                points += 40;
            default:
                points += 50;
        }
        System.out.println(points);
    }
}`,
    options: [
      { key: 'A', text: '20' },
      { key: 'B', text: '50' },
      { key: 'C', text: '140' },
      { key: 'D', text: '150' },
    ],
    correctOption: 'B',
    explanation:
      'Matching starts at case 2 (points += 20). Because there is no break statement on case 2, execution falls through into case 3 (points += 30, making points = 50). ' +
      'Case 3 has a break statement, which immediately exits the switch construct. The final value printed is 50.',
  },
];

module.exports = { javaQuestions };
