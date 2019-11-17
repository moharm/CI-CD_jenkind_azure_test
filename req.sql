create p = (mohcine:etudiant{nom:'harmouch',prenom:'mohcine',age:'21'})-[:publier]->
    (rechercher:publication{contenu:'baala;alal',date:'10/10/2007'}) return p