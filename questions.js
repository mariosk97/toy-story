
const questionSets = {
    easy: [
        {
            type: "multipleChoice",
            question: "Ποιο από αυτά είναι ζώο;",
            answers: ["Σκύλος", "Καρέκλα", "Μολύβι"],
            correctAnswer: 0
        },
        {
            type: "multipleChoice",
            question: "Τι χρώμα έχει συνήθως το γρασίδι;",
            answers: ["Μπλε", "Πράσινο", "Μαύρο"],
            correctAnswer: 1
        },
        {
            type: "typing",
            question: "Πού κελαηδάει το πουλί; Πάνω στο δέντρο ή μέσα στη θάλασσα;",
            answers: ["πάνω στο δέντρο"]
        }
    ],

    hard: [
        {
            type: "multipleChoice",
            question: "Πόσο κάνει 5 + 3;",
            answers: ["7", "8", "9"],
            correctAnswer: 1
        },
        {
            type: "multipleChoice",
            question: "Ποια εποχή έρχεται μετά τον χειμώνα;",
            answers: ["Καλοκαίρι", "Φθινόπωρο", "Άνοιξη"],
            correctAnswer: 2
        },
        {
            type: "typing",
            question: "Πού ζει το ψάρι; Στο νερό ή πάνω στα δέντρα;",
            answers: ["στο νερό"]
        }
    ]
};

export { questionSets };
