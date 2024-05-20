import React, { useEffect } from 'react';

const AcknowledgmentSummary = () => {
  return (
    <div id="acknowledgements">
      <details className="group">
        <summary>
          <strong>First draft</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          Many people have commented on and contributed to the first draft of
          this document, which was published in November 2022. We would
          especially like to thank the following people for providing their
          wisdom and insights:
        </p>
        <ul>
          <li>Jack Briggs</li>
          <li>Tim Harrison</li>
          <li>Philip Lazos</li>
          <li>Michael Madoff</li>
          <li>Evangelos Markakis</li>
          <li>Joel Telpner</li>
          <li>Thomas Upfield</li>
        </ul>
        <p>
          We would also like to thank those who have commented via Github and
          other channels.
        </p>
      </details>

      <details className="group">
        <summary>
          <strong>2023 Colorado Workshop (28/02 → 01/03)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Longmont, Colorado on February 28th and March 1st
          2023 for their valuable contributions to this CIP, and for their
          active championing of Cardano&#39;s vision for minimal viable
          governance. These include:
        </p>
        <ul>
          <li>Adam Rusch, ADAO &amp; Summon</li>
          <li>Addie Girouard</li>
          <li>Andrew Westberg</li>
          <li>Darlington Wleh, LidoNation</li>
          <li>Eystein Hansen</li>
          <li>James Dunseith, Gimbalabs</li>
          <li>Juana Attieh</li>
          <li>Kenric Nelson</li>
          <li>Lloyd Duhon, DripDropz</li>
          <li>Marcus Jay Allen</li>
          <li>Marek Mahut, 5 Binaries</li>
          <li>Markus Gufler</li>
          <li>Matthew Capps</li>
          <li>Mercy, Wada</li>
          <li>Michael Dogali</li>
          <li>Michael Madoff</li>
          <li>Patrick Tobler, NMKR</li>
          <li>Philip Lazos</li>
          <li>π Lanningham, SundaeSwap</li>
          <li>Rick McCracken</li>
          <li>Romain Pellerin</li>
          <li>Sergio Sanchez Ferreros</li>
          <li>Tim Harrison</li>
          <li>Tsz Wai Wu</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Mexico City, Mexico Workshop (20/05)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Mexico City, Mexico on May 20th 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Donovan Riaño</li>
          <li>Cristian Jair Rojas</li>
          <li>Victor Hernández</li>
          <li>Ramón Aceves</li>
          <li>Sergio Andrés Cortés</li>
          <li>Isaías Alejandro Galván</li>
          <li>Abigail Guzmán</li>
          <li>Jorge Fernando Murguía</li>
          <li>Luis Guillermo Santana</li>
        </ul>
      </details>

      <details className="group">
        <summary>
          <strong>2023 Buenos Aires, Argentina Workshop (20/05)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Buenos Aires, Argentina on May 20th 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Lucas Macchiavelli</li>
          <li>Alejando Pestchanker</li>
          <li>Juan Manuel Castro Pippo</li>
          <li>Federico Weill</li>
          <li>Jose Otegui</li>
          <li>Mercedes Ruggeri</li>
          <li>Mauro Andreoli</li>
          <li>Elias Aires</li>
          <li>Jorge Nasanovsky</li>
          <li>Ulises Barreiro</li>
          <li>Martin Ochoa</li>
          <li>Facundo Lopez</li>
          <li>Vanina Estrugo</li>
          <li>Luca Pestchanker</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Johannesburg, South Africa Workshop (25/05)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Johannesburg, South Africa on May 25th 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Celiwe Ngwenya</li>
          <li>Bernard Sibanda</li>
          <li>Dumo Mbobo</li>
          <li>Shaolyn Dzwedere</li>
          <li>Kunoshe Muchemwa</li>
          <li>Siphiwe Mbobo</li>
          <li>Lucas Sibindi</li>
          <li>DayTapoya</li>
          <li>Mdu Ngwenya</li>
          <li>Lucky Khumalo</li>
          <li>Skhangele Malinga</li>
          <li>Joyce Ncube</li>
          <li>Costa Katenhe</li>
          <li>Bramwell Kasanga</li>
          <li>Precious Abimbola</li>
          <li>Ethel Q Tshuma</li>
          <li>Panashe Sibanda</li>
          <li>Radebe Tefo</li>
          <li>Kaelo Lentsoe</li>
          <li>Richmond Oppong</li>
          <li>Israel Ncube</li>
          <li>Sikhangele Malinga</li>
          <li>Nana Safo</li>
          <li>Ndaba Delsie</li>
          <li>Collen Tshepang</li>
          <li>Dzvedere Shaolyn</li>
          <li>Thandazile Sibanda</li>
          <li>Ncube Joyce</li>
          <li>Lucas Sibindi</li>
          <li>Pinky Ferro</li>
          <li>Ishmael Ntuta</li>
          <li>Khumalo Lucky</li>
          <li>Fhulufelo</li>
          <li>Thwasile Ngwenya</li>
          <li>Kunashe Muchemwa</li>
          <li>Dube Bekezela</li>
          <li>Tinyiko Baloi</li>
          <li>Dada Nomathemba</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Bogota, Colombia Workshop (27/05)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Bogota, Colombia on May 27th 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Alvaro Moncada</li>
          <li>Jaime Andres Posada Castro</li>
          <li>Jose Miguel De Gamboa</li>
          <li>Nicolas Gomez</li>
          <li>Luis Restrepo (Moxie)</li>
          <li>Juanita Jaramillo R.</li>
          <li>Daniel Vanegas</li>
          <li>Ernesto Rafael Pabon Moreno</li>
          <li>Carlos Eduardo Escobar</li>
          <li>Manuel Fernando Briceño</li>
          <li>Sebastian Pabon</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Caracas, Venezuela Workshop (27/05)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Caracas, Venezuela on May 27th 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Jean Carlo Aguilar</li>
          <li>Wilmer Varón</li>
          <li>José Erasmo Colmenares</li>
          <li>David Jaén</li>
          <li>Félix Dávila</li>
          <li>Yaneth Duarte</li>
          <li>Nando Vitti</li>
          <li>Wilmer Rojas</li>
          <li>Andreina García</li>
          <li>Carmen Galban</li>
          <li>Osmarlina Agüero</li>
          <li>Ender Linares</li>
          <li>Carlos A. Palacios R</li>
          <li>Dewar Rodríguez</li>
          <li>Lennys Blanco</li>
          <li>Francys García</li>
          <li>Davidson Arenas</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Manizales, Colombia Workshop (27/05)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Manizales, Colombia on May 27th 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Yaris Cruz</li>
          <li>Yaneth Duarte</li>
          <li>Ciro Gelvez</li>
          <li>Kevin Chacon</li>
          <li>Juan Sierra</li>
          <li>Caue Chianca</li>
          <li>Sonia Malagon</li>
          <li>Facundo Ramirez</li>
          <li>Hope R.</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Addis Ababa, Ethiopia Workshop (27/05 & 28/5)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Addis Ababa, Ethiopia on May 27th and 28th 2023 for
          their valuable contributions to this CIP, and for their active
          championing of Cardano&#39;s vision for minimal viable governance.
          These include:
        </p>
        <ul>
          <li>Kaleb Dori</li>
          <li>Eyassu Birru</li>
          <li>Matthew Thornton</li>
          <li>Tamir Kifle</li>
          <li>Kirubel Tabu</li>
          <li>Bisrat Miherete</li>
          <li>Emmanuel Khatchadourian</li>
          <li>Tinsae Teka</li>
          <li>Yoseph Ephrem</li>
          <li>Yonas Eshetu</li>
          <li>Hanna Kaleab</li>
          <li>Tinsae Teka</li>
          <li>Robee Meseret</li>
          <li>Matias Tekeste</li>
          <li>Eyasu Birhanu</li>
          <li>yonatan berihun</li>
          <li>Nasrallah Hassan</li>
          <li>Andinet Assefa</li>
          <li>Tewodros Sintayehu</li>
          <li>KIDUS MENGISTEAB</li>
          <li>Djibril Konate</li>
          <li>Nahom Mekonnen</li>
          <li>Eyasu Birhanu</li>
          <li>Eyob Aschenaki</li>
          <li>Tinsae Demissie</li>
          <li>Yeabsira Tsegaye</li>
          <li>Tihitna Miroche</li>
          <li>Mearaf Tadewos</li>
          <li>Yab Mitiku</li>
          <li>Habtamu Asefa</li>
          <li>Dawit Mengistu</li>
          <li>Nebiyu Barsula</li>
          <li>Nebiyu Sultan</li>
          <li>Nathan Samson</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>
            2023 Kyoto and Fukuoka, Japan Workshop (27/05 & 10/06 )
          </strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Kyoto and Fukuoka, Japan on May 27th and June 10th
          2023 for their valuable contributions to this CIP, and for their
          active championing of Cardano&#39;s vision for minimal viable
          governance. These include:
        </p>
        <ul>
          <li>Arimura</li>
          <li>Hidemi</li>
          <li>Nagamaru(SASApool)</li>
          <li>shiodome47(SODMpool)</li>
          <li>Wakuda(AID1pool)</li>
          <li>Yuta(Yuki Oishi)</li>
          <li>Andrew</li>
          <li>BANCpool</li>
          <li>Miyatake</li>
          <li>Muen</li>
          <li>Riekousagi</li>
          <li>SMAN8(SA8pool)</li>
          <li>Tatsuya</li>
          <li>カッシー</li>
          <li>松</li>
          <li>ポンタ</li>
          <li>リサ</li>
          <li>Mako</li>
          <li>Ririco</li>
          <li>ながまる</li>
          <li>Baku</li>
          <li>マリア</li>
          <li>たりふん</li>
          <li>JUNO</li>
          <li>Kinoko</li>
          <li>Chikara</li>
          <li>ET</li>
          <li>Akira555</li>
          <li>Kent</li>
          <li>Ppp</li>
          <li>Shiodome47</li>
          <li>Sam</li>
          <li>ポール</li>
          <li>Concon</li>
          <li>Sogame</li>
          <li>ハンド</li>
          <li>Demi</li>
          <li>Nonnon</li>
          <li>banC</li>
          <li>SMAN8(SA8pool)</li>
          <li>りんむ</li>
          <li>Kensin</li>
          <li>りえこうさぎ</li>
          <li>アダマンタイト</li>
          <li>の/ゆすけ</li>
          <li>MUEN</li>
          <li>いちごだいふく</li>
          <li>Ranket</li>
          <li>A.yy</li>
          <li>N S</li>
          <li>Kazuya</li>
          <li>Daikon</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Monterey, California Workshop (28/05)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Monterey, California on May 28th 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Shane Powser</li>
          <li>Rodrigo Gomez</li>
          <li>Adam K. Dean</li>
          <li>John C. Valdez</li>
          <li>Kyle Solomon</li>
          <li>Erick &quot;Mag&quot; Magnana</li>
          <li>Bryant Austin</li>
          <li>John Huthmaker</li>
          <li>Ayori Selassie</li>
          <li>Josh Noriega</li>
          <li>Matthias Sieber</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Tlaxcala, Mexico Workshop (01/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Tlaxcala, Mexico on June 1st 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Victor Hernández</li>
          <li>Cristian Jair Rojas</li>
          <li>Miriam Mejia</li>
          <li>Josmar Cabañas</li>
          <li>Lizbet Delgado</li>
          <li>José Alberto Sánchez</li>
          <li>Fátima Valeria Zamora</li>
          <li>Julio César Montiel</li>
          <li>Jesús Pérez</li>
          <li>José Adrián López</li>
          <li>Lizbeth Calderón</li>
          <li>Zayra Molina</li>
          <li>Nayelhi Pérez</li>
          <li>Josué Armas</li>
          <li>Diego Talavera</li>
          <li>Darían Gutiérrez</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 LATAM Virtual Workshop (03/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in LATAM Virtual on June 3rd 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Juan Sierra</li>
          <li>@CaueChianca</li>
          <li>Ernesto Rafael</li>
          <li>Pabon Moreno</li>
          <li>Sonia Malagon</li>
          <li>Facundo Ramírez</li>
          <li>Mercedes Ruggeri</li>
          <li>Hope R.</li>
          <li>Yaris Cruz</li>
          <li>Yaneth Duarte</li>
          <li>Ciro Gélvez</li>
          <li>Kevin Chacon</li>
          <li>Juanita Jaramillo</li>
          <li>Sebastian Pabon</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Worcester, Massachusetts Workshop (08/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Worcester, Massachusetts on June 8th 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>CardanoSharp</li>
          <li>Kenric Nelson</li>
          <li>Matthias Sieber</li>
          <li>Roberto Mayen</li>
          <li>Ian Burzynski</li>
          <li>omdesign</li>
          <li>Chris Gianelloni</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Chicago, Illinois Workshop (10/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Chicago, Illinois on June 10th 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Adam Rusch</li>
          <li>Jose Martinez</li>
          <li>Michael McNulty</li>
          <li>Vanessa Villanueva Collao</li>
          <li>Maaz Jedh</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Virtual Workshop (12/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held virtually on June 12th 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Rojo Kaboti</li>
          <li>Tommy Frey</li>
          <li>Tevo Saks</li>
          <li>Slate</li>
          <li>UBIO OBU</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Toronto, Canada Workshop (15/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Toronto, Canada on June 15th 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>John MacPherson</li>
          <li>Lawrence Ley</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Philadelphia, Pennsylvania Workshop (17/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Philadelphia, Pennsylvania on June 17th 2023 for
          their valuable contributions to this CIP, and for their active
          championing of Cardano&#39;s vision for minimal viable governance.
          These include:
        </p>
        <ul>
          <li>NOODZ</li>
          <li>Jarhead</li>
          <li>Jenny Brito</li>
          <li>Shepard</li>
          <li>BONE Pool</li>
          <li>type_biggie</li>
          <li>FLAWWD</li>
          <li>A.I. Scholars</li>
          <li>Eddie</li>
          <li>Joker</li>
          <li>Lex</li>
          <li>Jerome</li>
          <li>Joey</li>
          <li>SwayZ</li>
          <li>Cara Mia</li>
          <li>PHILLY 1694</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Santiago de Chile Workshop (17/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Santiago de Chile on June 17th 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Rodrigo Oyarsun</li>
          <li>Sebastián Aravena</li>
          <li>Musashi Fujio</li>
          <li>Geo Gavo</li>
          <li>Lucía Escobar</li>
          <li>Juan Cruz Franco</li>
          <li>Natalia Rosa</li>
          <li>Cristian M. García</li>
          <li>Alejandro Montalvo</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Virtual Workshop (17/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held virtually on June 17th 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Juana Attieh</li>
          <li>Nadim Karam</li>
          <li>Amir Azem</li>
          <li>Rami Hanania</li>
          <li>LALUL Stake Pool</li>
          <li>HAWAK Stake Pool</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Taipai, Taiwan Workshop (18/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Taipai, Taiwan on June 18th 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Michael Rogero</li>
          <li>Ted Chen</li>
          <li>Mic</li>
          <li>Jeremy Firster </li>
          <li>Eric Tsai</li>
          <li>Dylan Chiang</li>
          <li>JohnsonCai</li>
          <li>DavidCHIEN</li>
          <li>Zach Gu</li>
          <li>Jimmy WANG</li>
          <li>JackTsai</li>
          <li>Katherine Hung</li>
          <li>Will Huang</li>
          <li>Kwicil</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>
            2023 Midgard Vikingcenter Horten, Norway Workshop (19/06)
          </strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Midgard Vikingcenter Horten, Norway on June 19th 2023
          for their valuable contributions to this CIP, and for their active
          championing of Cardano&#39;s vision for minimal viable governance.
          These include:
        </p>
        <ul>
          <li>Daniel D. Johnsen</li>
          <li>Thomas Lindseth</li>
          <li>Eystein Hansen</li>
          <li>Gudbrand Tokerud </li>
          <li>Lally McClay</li>
          <li>$trym</li>
          <li>Arne Rasmussen</li>
          <li>Lise WesselTVVIN</li>
          <li>Bjarne </li>
          <li>Jostein Aanderaa</li>
          <li>Ken-Erik Ølmheim</li>
          <li>DimSum</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Virtual Workshop (19/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held virtually on June 19th 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Nicolas Cerny</li>
          <li>Nils Peuser</li>
          <li>Riley Kilgore</li>
          <li>Alejandro Almanza</li>
          <li>Jenny Brito</li>
          <li>John C. Valdez</li>
          <li>Rhys</li>
          <li>Thyme</li>
          <li>Adam Rusch</li>
          <li>Devryn</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 New York City, New York Workshop (20/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in New York City, New York on June 20th 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>John Shearing</li>
          <li>Geoff Shearing</li>
          <li>Daniela Balaniuc</li>
          <li>SDuffy</li>
          <li>Garry Golden</li>
          <li>Newman</li>
          <li>Emmanuel Batse</li>
          <li>Ebae</li>
          <li>Mojira</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 La Cumbre, Argentina Workshop (23/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in La Cumbre, Argentina on June 23rd 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Ulises Barreiro</li>
          <li>Daniel F. Rodriguez</li>
          <li>Dominique Gromez</li>
          <li>Leandro Chialvo</li>
          <li>Claudia Vogel</li>
          <li>Guillermo Lucero</li>
          <li>Funes, Brian Carrasco</li>
          <li>Melisa Carrasco</li>
          <li>Carlos Carrasco</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Minneapolis, Minnesota Workshop (23/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Minneapolis, Minnesota on June 23rd 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Stephanie King</li>
          <li>Darlington Wleh</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 La Plata, Argentina Workshop (23/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in La Plata, Argentina on June 23rd 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Mauro Andreoli</li>
          <li>Rodolfo Miranda</li>
          <li>Agustin Francella</li>
          <li>Federico Sting</li>
          <li>Elias Aires</li>
          <li>Lucas Macchiavelli</li>
          <li>Pablo Hernán Mazzitelli</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Puerto Madryn, Argentina Workshop (23/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Puerto Madryn, Argentina on June 23rd 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Andres Torres Borda</li>
          <li>Federico Ledesma Calatayud</li>
          <li>Maximiliano Torres</li>
          <li>Federico Prado</li>
          <li>Domingo Torres</li>
          <li>Floriana Pérez Barria</li>
          <li>Martin Real</li>
          <li>Florencia García</li>
          <li>Roberto Neme</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Accra, Ghana Workshop (24/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Accra, Ghana on June 24th 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Wada</li>
          <li>Laurentine</li>
          <li>Christopher A.</li>
          <li>Nathaniel D.</li>
          <li>Edufua</li>
          <li>Michael</li>
          <li>Augusta</li>
          <li>Jeremiah</li>
          <li>Boaz</li>
          <li>Mohammed</li>
          <li>Richmond O.</li>
          <li>Ezekiel</li>
          <li>Megan</li>
          <li>Josue</li>
          <li>Michel T.</li>
          <li>Bineta</li>
          <li>Afia O.</li>
          <li>Mercy</li>
          <li>Enoch</li>
          <li>Kofi</li>
          <li>Awura</li>
          <li>Emelia</li>
          <li>Richmond S.</li>
          <li>Solomon</li>
          <li>Phillip</li>
          <li>Faakor</li>
          <li>Manfo</li>
          <li>Josh</li>
          <li>Daniel</li>
          <li>Mermose</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Virtual Workshop (24/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held virtually on June 24th 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Jonas Riise</li>
          <li>Thomas Lindseth</li>
          <li>André &quot;Eilert&quot; Eilertsen</li>
          <li>Eystein Hansen</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Seoul, South Korea Workshop (24/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Seoul, South Korea on June 24th 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Oscar Hong (JUNGI HONG)</li>
          <li>SPO_COOL (Kevin Kordano)</li>
          <li>SPO_KTOP (KT OH)</li>
          <li>WANG JAE LEE</li>
          <li>JAE HYUN AN</li>
          <li>INYOUNG MOON (Penny)</li>
          <li>HOJIN JEON</li>
          <li>SEUNG KYU BAEK</li>
          <li>SA SEONG MAENG</li>
          <li>JUNG MYEONG HAN</li>
          <li>BRIAN KIM</li>
          <li>JUNG HOON KIM</li>
          <li>SEUNG WOOK JUNG (Peter)</li>
          <li>HYUNG WOO PARK</li>
          <li>EUN JAE CHOI</li>
          <li>NA GYEONG KIM</li>
          <li>JADEN CHOI</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Abu Dhabi, UAE Workshop (25/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Abu Dhabi, UAE on June 25th 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Amir Azem</li>
          <li>Ian Arden</li>
          <li>Madina Abdibayeva</li>
          <li>BTBF (Yu Kagaya)</li>
          <li>محمد الظاهري</li>
          <li>Tegegne Tefera</li>
          <li>Rami Hanania</li>
          <li>Tania Debs</li>
          <li>Khalil Jad</li>
          <li>Mohamed Jamal</li>
          <li>Ruslan Yakubov</li>
          <li>OUSHEK Mohamed eisa</li>
          <li>Shehryar</li>
          <li>Wael Ben Younes</li>
          <li>Santosh Ray</li>
          <li>Juana Attieh</li>
          <li>Nadim Karam</li>
          <li>DubaistakePool</li>
          <li>HAWAK Pool</li>
          <li>LALKUL Stake Pools</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Williamsburg, New York Workshop (25/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Williamsburg, New York on June 25th 2023 for their
          valuable contributions to this CIP, and for their active championing
          of Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Pi</li>
          <li>Joseph</li>
          <li>Skyler</li>
          <li>Forrest</li>
          <li>Gabriel</li>
          <li>Newman</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Lagos, Nigeria Workshop (28/06)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Lagos, Nigeria on June 28th 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Jonah Benson</li>
          <li>Augusta</li>
          <li>Ubio Obu</li>
          <li>Olumide Hrosuosegbe</li>
          <li>Veralyn Chinenye</li>
          <li>Ona Ohimer</li>
          <li>William Ese</li>
          <li>Ruth Usoro</li>
          <li>William P</li>
          <li>Esther Simi</li>
          <li>Daniel Effiom</li>
          <li>Akinkurai Toluwalase</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Sao Paulo, Brazil Workshop (01/07)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Sao Paulo, Brazil on July 1st 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Otávio Lima</li>
          <li>Rodrigo Pacini</li>
          <li>Maria Carmo</li>
          <li>Cauê Chianca</li>
          <li>Daniela Alves</li>
          <li>Jose Lins Dias</li>
          <li>Felipe Barcelos</li>
          <li>Rosana Melo</li>
          <li>Johnny Oliveira</li>
          <li>Lucas Ravacci</li>
          <li>Cristofer Ramos</li>
          <li>Weslei Menck</li>
          <li>Leandro Tsutsumi</li>
          <li>Izaias Pessoa</li>
          <li>Gabriel Melo</li>
          <li>Yuri Nabeshima</li>
          <li>Alexandre Fernandes</li>
          <li>Vinicius Ferreiro</li>
          <li>Lucas Fernandes</li>
          <li>Alessandro Benicio</li>
          <li>Mario Cielho</li>
          <li>Lory Fernandes Lima</li>
          <li>Larissa Nogueira</li>
          <li>Latam Cardano Community</li>
        </ul>
      </details>
      <details className="group">
        <summary>
          <strong>2023 Brazil Virtual Workshop (04/07)</strong>
          <span className="transition group-open:rotate-180">
            <img src="/chevron-down.svg" alt="down" />
          </span>
        </summary>

        <p>
          In addition, we would like to thank all the attendees of the workshop
          that was held in Brazil on July 4th 2023 for their valuable
          contributions to this CIP, and for their active championing of
          Cardano&#39;s vision for minimal viable governance. These include:
        </p>
        <ul>
          <li>Lincon Vidal</li>
          <li>Thiago da Silva Nunes</li>
          <li>Rodrigo Pacini</li>
          <li>Livia Corcino de Albuquerque</li>
          <li>Cauê Chianca</li>
          <li>Otávio Lima</li>
        </ul>
      </details>
    </div>
  );
};

export default AcknowledgmentSummary;
